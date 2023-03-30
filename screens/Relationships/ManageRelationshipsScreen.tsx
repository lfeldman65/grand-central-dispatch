import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { Text, View, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import AddRelScreen from './AddRelationshipScreen';
import AtoZRow from './AtoZRow';
import RankingRow from './RankingRow';
import GroupsRow from './GroupsRow';
import { getGroupsData, getRolodexData } from './api';
import { GroupsDataProps, RolodexDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import React from 'react';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { AlphabetList, IData } from 'react-native-section-alphabet-list';
import { ga4Analytics } from '../../utils/general';
import { styles } from './styles';
import { storage } from '../../utils/storage';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
const cache_prefix = 'cache_relationship_';

type TabType = 'a-z' | 'ranking' | 'groups';
var localDisplay = 'First Last';

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('a-z');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]); // A-Z
  const [rankingRolodex, setRankingRolodex] = useState<RolodexDataProps[]>([]); //Ranking tabs
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);
  const [isLoadingForRolodex, setIsLoadingForRolodex] = useState(true);
  const [isLoadingForRanking, setIsLoadingForRanking] = useState(true);
  const [isLoadingForGroups, setIsLoadingForGroups] = useState(true);

  const [lightOrDark, setLightOrDark] = useState('');

  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const handleRowPress = (index: number) => {
    ga4Analytics('Relationships_Row', {
      contentType: prettyTabName(tabSelected),
      itemId: 'id0507',
    });
    if (tabSelected == 'groups') {
      console.log('group name:' + dataGroups[index].groupName);
      console.log('group id:' + dataGroups[index].id);
      navigation.navigate('GroupMembersScreen', {
        groupID: dataGroups[index].id,
        groupName: dataGroups[index].groupName,
        lightOrDark: lightOrDark,
      });
    } else if (tabSelected == 'a-z') {
      navigation.navigate('RelDetails', {
        contactId: dataRolodex[index].id,
        firstName: dataRolodex[index].firstName,
        lastName: dataRolodex[index].lastName,
        lightOrDark: lightOrDark,
      });
    } else if (tabSelected == 'ranking') {
      navigation.navigate('RelDetails', {
        contactId: rankingRolodex[index].id,
        firstName: rankingRolodex[index].firstName,
        lastName: rankingRolodex[index].lastName,
        lightOrDark: lightOrDark,
      });
    }
  };

  function getIndex() {
    if (tabSelected == 'a-z')
      return dataRolodex.map((e) => {
        if (localDisplay == 'First Last') return { value: e.firstName, key: e.id };
        else return { value: e.lastName, key: e.id };
      });
    if (tabSelected == 'ranking')
      return rankingRolodex.map((e) => {
        return { value: e.ranking, key: e.id };
      });
    else if (tabSelected == 'groups')
      //console.log('groups ' + dataGroups.length)
      return dataGroups.map((e) => {
        return { value: e.groupName, key: e.id };
      });
  }

  // useEffect(() => {}, []);

  useEffect(() => {
    getCurrentDisplayAZ(true);
    showFilterTitle();
    //  fetchData(tabSelected, true);
  }, [isFilterRel]);

  useEffect(() => {
    fetchData(tabSelected, true);
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Relationships',
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
      tab: tabSelected,
    });
  }, [navigation]);

  function showFilterTitle() {
    if (isFilterRel) {
      return 'Rel';
    }
    return 'Biz';
  }

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
  }

  function prettyTabName(ugly: TabType) {
    if (ugly == 'a-z') return 'AZ';
    if (ugly == 'ranking') return 'Ranking';
    return 'Groups';
  }

  function handleAddRelPressed() {
    ga4Analytics('Relationships_Add', {
      contentType: prettyTabName(tabSelected),
      itemId: 'id0506',
    });
    setModalVisible(true);
  }

  function azPressed() {
    ga4Analytics('Relationships_AZ_Tab', {
      contentType: 'none',
      itemId: 'id0501',
    });
    setTabSelected('a-z');
    fetchData('a-z', false);
  }

  function rankingPressed() {
    ga4Analytics('Relationships_Ranking_Tab', {
      contentType: 'none',
      itemId: 'id0502',
    });
    setTabSelected('ranking');
    fetchData('ranking', false);
  }

  function groupsPressed() {
    ga4Analytics('Relationships_Groups_Tab', {
      contentType: 'none',
      itemId: 'id0503',
    });
    setTabSelected('groups');
    fetchData('groups', false);
  }

  function filterPressed() {
    if (isFilterRel) {
      ga4Analytics('Relationships_Show_Businesses', {
        contentType: 'none',
        itemId: 'id0504',
      });
      setIsFilterRel(false);
    } else {
      ga4Analytics('Relationships_Show_Relationships', {
        contentType: 'none',
        itemId: 'id0505',
      });
      setIsFilterRel(true);
      showFilterTitle();
    }
  }

  async function getCurrentDisplayAZ(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var saved = await storage.getItem('displayAZ');
    if (saved != null) {
      localDisplay = saved;
      //console.log('getCurrent1: ' + localDisplay);
    } else {
      localDisplay = 'First Last';
      //console.log('getCurrent2: ' + localDisplay);
    }
  }

  const checkFileExists = async (filename: any) => {
    //const fileUri = FileSystem.documentDirectory + filename;
    try {
      const fileInfo = await FileSystem.getInfoAsync(filename);
      return fileInfo.exists;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  async function readFromFile(param: TabType) {
    //the file is the source of truth for data, this should be only place where data is set
    const fileUri = FileSystem.documentDirectory + cache_prefix + param;
    //console.log('read ' + fileUri);
    const fileExists = await checkFileExists(fileUri);
    console.log('file exists ' + fileExists); // Output: true or false
    if (fileExists) {
      const readData = await FileSystem.readAsStringAsync(fileUri);
      //console.log('readData: ' + readData);
      const rawData = JSON.parse(readData);
      if (param == 'a-z') {
        setDataRolodex(rawData);
        setIsLoadingForRolodex(false);
      } else if (param == 'ranking') {
        setRankingRolodex(rawData);
        setIsLoadingForRanking(false);
      } else if (param == 'groups') {
        setDataGroups(rawData);
        setIsLoadingForGroups(false);
      }
    }
  }

  async function saveDataToFile(param: TabType, data: RolodexDataProps[] | GroupsDataProps[]) {
    const fileUri = FileSystem.documentDirectory + cache_prefix + param;
    //console.log(fileUri);
    var r = await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    //console.log('write ' + r);
  }

  function isDataEmpty(param: TabType) {
    if (param == 'a-z' && dataRolodex.length == 0) return true;
    if (param == 'ranking' && rankingRolodex.length == 0) return true;
    if (param == 'groups' && dataGroups.length == 0) return true;
    return false;
  }

  function fetchData(param: TabType, makeAPICall: boolean) {
    console.log('fetchData:' + param);
    setIsLoadingForTab(param, true);
    if (makeAPICall || isDataEmpty(param)) {
      if (param != 'groups') {
        fetchRolodex(param, true);
      } else {
        fetchGroups(true);
      }
    }
    if (isDataEmpty(param)) readFromFile(param);
  }

  async function fetchRolodex(param: TabType, isMounted: boolean) {
    var type = param == 'a-z' ? 'alpha' : param == 'ranking' ? 'ranking' : '';
    getRolodexData(type)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          const filteredRolodex = res.data.filter((d) => typeof d.contactTypeID !== 'undefined');
          param == 'a-z' ? setDataRolodex(filteredRolodex) : setRankingRolodex(filteredRolodex);
          saveDataToFile(param, filteredRolodex);
        }
        setIsLoadingForTab(param, false);
      })
      .catch((error) => {
        setIsLoadingForTab(param, false);
        console.error('failure ' + error);
      });
  }

  function fetchGroups(isMounted: boolean) {
    getGroupsData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          const filteredGroups = res.data.filter((d) => typeof d.groupName !== 'undefined');
          //console.log(filteredGroups);
          setDataGroups(filteredGroups);
          saveDataToFile('groups', filteredGroups);
          setIsLoadingForTab('groups', false);
        }
      })
      .catch((error) => {
        setIsLoadingForTab('groups', false);
        console.error('failure ' + error);
      });
  }

  function saveComplete() {
    //we can optimize this in the future, no need to fetch everything where only 1 record has changed
    fetchData(tabSelected, true);
  }

  function shouldShowSpinner() {
    if (tabSelected == 'a-z' && isLoadingForRolodex) return true;
    else if (tabSelected == 'ranking' && isLoadingForRanking) return true;
    else if (tabSelected == 'groups' && isLoadingForGroups) return true;
    return false;
  }

  function setIsLoadingForTab(param: TabType, value: boolean) {
    if (param == 'a-z') setIsLoadingForRolodex(value && dataRolodex.length == 0);
    if (param == 'ranking') setIsLoadingForRanking(value && rankingRolodex.length == 0);
    if (param == 'groups') setIsLoadingForGroups(value && dataGroups.length == 0);
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <View style={globalStyles.tabButtonRow}>
          <Text style={tabSelected == 'a-z' ? globalStyles.selected : globalStyles.unselected} onPress={azPressed}>
            A-Z
          </Text>
          <Text
            style={tabSelected == 'ranking' ? globalStyles.selected : globalStyles.unselected}
            onPress={rankingPressed}
          >
            Ranking
          </Text>
          <Text
            style={tabSelected == 'groups' ? globalStyles.selected : globalStyles.unselected}
            onPress={groupsPressed}
          >
            Groups
          </Text>
        </View>

        {shouldShowSpinner() ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        ) : (
          <React.Fragment>
            {tabSelected != 'groups' && (
              <View style={globalStyles.filterRow}>
                <TouchableOpacity onPress={filterPressed}>
                  <Text style={globalStyles.filterText}>{isFilterRel ? 'Show Businesses' : 'Show Relationships'}</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.rolodex}>
              {true && (
                <AlphabetList
                  data={getIndex()!}
                  extraData={
                    tabSelected == 'a-z' ? dataRolodex : tabSelected == 'ranking' ? rankingRolodex : dataGroups
                  }
                  indexLetterContainerStyle={{
                    width: 20,
                  }}
                  letterListContainerStyle={{
                    width: 40,
                    alignItems: 'flex-start',
                  }}
                  indexLetterStyle={{
                    color: '#1398f5',
                    fontSize: 14,
                    height: 60,
                  }}
                  indexContainerStyle={{
                    width: 20,
                  }}
                  renderCustomItem={(item) =>
                    tabSelected == 'a-z' && dataRolodex.some((e) => e.id == item.key) ? (
                      <AtoZRow
                        relFromAbove={showFilterTitle()}
                        data={dataRolodex.find((e) => e.id == item.key)!}
                        onPress={() => handleRowPress(dataRolodex.findIndex((e) => e.id == item.key))}
                        lightOrDark={lightOrDark}
                      />
                    ) : tabSelected == 'ranking' && rankingRolodex.some((e) => e.id == item.key) ? (
                      <RankingRow
                        relFromAbove={showFilterTitle()}
                        data={rankingRolodex.find((e) => e.id == item.key)!}
                        onPress={() => handleRowPress(rankingRolodex.findIndex((e) => e.id == item.key))}
                        lightOrDark={lightOrDark}
                      />
                    ) : tabSelected == 'groups' && dataGroups.some((e) => e.id == item.key) ? (
                      <GroupsRow
                        data={dataGroups.find((e) => e.id == item.key)!}
                        onPress={() => handleRowPress(dataGroups.findIndex((e) => e.id == item.key))}
                        lightOrDark={lightOrDark}
                      />
                    ) : (
                      <View></View>
                    )
                  }
                  renderCustomSectionHeader={(section) => (
                    <View style={styles.sectionHeaderContainer}>
                      <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
                    </View>
                  )}
                />
              )}
            </View>

            <TouchableOpacity style={globalStyles.bottomContainer} onPress={() => handleAddRelPressed()}>
              <View style={globalStyles.addButton}>
                <Text style={globalStyles.addText}>{'Add Relationship'}</Text>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        )}
        {modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <AddRelScreen title={'New Relationship'} onSave={saveComplete} setModalVisible={setModalVisible} />
          </Modal>
        )}
      </View>
      {quickSearchVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={quickSearchVisible}
          onRequestClose={() => {
            setQuickSearchVisible(!quickSearchVisible);
          }}
        >
          <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
        </Modal>
      )}
    </>
  );
}
