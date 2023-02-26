import { useState } from 'react';
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

type TabType = 'a-z' | 'ranking' | 'groups';
var localDisplay = 'First Last';

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('a-z');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]); // A-Z and Ranking tabs
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [alphaIndex, setAlphaIndex] = useState<IData[]>([]);
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
    } else {
      navigation.navigate('RelDetails', {
        contactId: dataRolodex[index].id,
        firstName: dataRolodex[index].firstName,
        lastName: dataRolodex[index].lastName,
        lightOrDark: lightOrDark,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    getCurrentDisplayAZ(true);
    if (tabSelected == 'a-z') {
      fetchRolodexPressed('alpha', isMounted);
    } else if (tabSelected == 'ranking') {
      fetchRolodexPressed('ranking', isMounted);
    } else {
      fetchGroupsPressed(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    showFilterTitle();
    if (tabSelected == 'a-z') {
      fetchRolodexPressed('alpha', isMounted);
    } else if (tabSelected == 'ranking') {
      fetchRolodexPressed('ranking', isMounted);
    } else {
      fetchGroupsPressed(isMounted);
    }
  }, [isFilterRel]);

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

  useEffect(() => {
    fetchRolodexPressed(tabSelected, true);
    console.log(tabSelected);
  }, [isFilterRel]);

  useEffect(() => {
    showFilterTitle();
  }, [isFilterRel]);

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
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
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
    fetchRolodexPressed('alpha', true);
  }

  function rankingPressed() {
    ga4Analytics('Relationships_Ranking_Tab', {
      contentType: 'none',
      itemId: 'id0502',
    });
    setTabSelected('ranking');
    fetchRolodexPressed('ranking', true);
  }

  function groupsPressed() {
    ga4Analytics('Relationships_Groups_Tab', {
      contentType: 'none',
      itemId: 'id0503',
    });
    setTabSelected('groups');
    fetchGroupsPressed(true);
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
      console.log('getCurrent1: ' + localDisplay);
    } else {
      localDisplay = 'First Last';
      console.log('getCurrent2: ' + localDisplay);
    }
  }

  async function fetchRolodexPressed(type: string, isMounted: boolean) {
    setIsLoading(true);
    getRolodexData(type)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          var ad: IData[] = [];
          //  console.log('LOCAL: ' + localDisplay);
          if (localDisplay == 'First Last') {
            res.data.forEach((e) => {
              ad.push({ value: e.firstName, key: e.id });
              //   console.log('FIRSTNAME: ' + e.firstName);
            });
          } else {
            res.data.forEach((e) => {
              ad.push({ value: e.lastName, key: e.id });
            });
          }
          setAlphaIndex(ad);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchGroupsPressed(isMounted: boolean) {
    setIsLoading(true);
    getGroupsData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataGroups(res.data);
          var ad: IData[] = [];
          res.data.forEach((e) => {
            ad.push({ value: e.groupName, key: e.id });
          });
          setAlphaIndex(ad);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function saveComplete() {
    fetchRolodexPressed('alpha', true);
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

        {isLoading ? (
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
              <AlphabetList
                data={alphaIndex}
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
                  tabSelected == 'a-z' ? (
                    <AtoZRow
                      relFromAbove={showFilterTitle()}
                      data={dataRolodex.find((e) => e.id == item.key)!}
                      onPress={() => handleRowPress(dataRolodex.findIndex((e) => e.id == item.key))}
                      lightOrDark={lightOrDark}
                    />
                  ) : tabSelected == 'ranking' ? (
                    <RankingRow
                      relFromAbove={showFilterTitle()}
                      data={dataRolodex.find((e) => e.id == item.key)!}
                      onPress={() => handleRowPress(dataRolodex.findIndex((e) => e.id == item.key))}
                      lightOrDark={lightOrDark}
                    />
                  ) : (
                    <GroupsRow
                      data={dataGroups.find((e) => e.id == item.key)!}
                      onPress={() => handleRowPress(dataGroups.findIndex((e) => e.id == item.key))}
                      lightOrDark={lightOrDark}
                    />
                  )
                }
                renderCustomSectionHeader={(section) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
                  </View>
                )}
              />
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
