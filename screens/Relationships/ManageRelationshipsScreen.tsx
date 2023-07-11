import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import {
  Button,
  SectionList,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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
import { ga4Analytics } from '../../utils/general';
import { styles } from './styles';
import { storage } from '../../utils/storage';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import NetInfo from '@react-native-community/netinfo';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { isFirstLetterAlpha } from './relationshipHelpers';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
const cache_prefix = 'cache_relationship_';
const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

type TabType = 'a-z' | 'ranking' | 'groups';
var localDisplay = 'First Last';

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('a-z');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [azRolodex, setAZRolodex] = useState<RolodexDataProps[]>([]);
  const [rankingRolodex, setRankingRolodex] = useState<RolodexDataProps[]>([]);
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);
  const [isLoadingForRolodex, setIsLoadingForRolodex] = useState(true);
  const [isLoadingForRanking, setIsLoadingForRanking] = useState(true);
  const [isLoadingForGroups, setIsLoadingForGroups] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'; // branch
  const indexCharArray = letters.split('');

  const ranking = 'ZABC';
  const rankingArray = ranking.split('');

  var sectionDataAZ: DataAZ[] = [];
  var sectionDataRanking: DataRanking[] = [];
  var sectionDataGroups: DataGroups[] = [];

  type DataAZ = {
    title: string;
    data: (RolodexDataProps | null)[];
  };

  type DataRanking = {
    title: string;
    data: (RolodexDataProps | null)[];
  };

  type DataGroups = {
    title: string;
    data: (GroupsDataProps | null)[];
  };

  //A -> Adrian, Alex, Anderson
  //B -> Beatricia, Betty

  function getSectionDataAZ(): DataAZ[] {
    console.log('In az mode');
    var indexArray = indexCharArray;
    console.log(azRolodex.length);
    var azData = azRolodex.filter((e) => e.contactTypeID == showFilterTitle());
    console.log(azData.length);
    const data: DataAZ[] = indexArray.map((indexChar) => {
      const contacts = azData.map((e) => {
        if (showFilterTitle() == 'Rel') {
          if (localDisplay == 'First Last') {
            if (e.firstName.substring(0, 1) == indexChar) {
              return e;
            }
            if (indexChar == '#') {
              if (!isFirstLetterAlpha(e.firstName)) {
                return e;
              }
              return null;
            }
            return null;
          }
          if (e.lastName.substring(0, 1) == indexChar) {
            return e;
          }
          if (indexChar == '#') {
            if (!isFirstLetterAlpha(e.lastName)) {
              return e;
            }
            return null;
          }
          return null;
        } else {
          if (e.employerName.substring(0, 1) == indexChar) {
            return e;
          }
          return null;
        }
      });
      // console.log("length before " + contacts.length);
      var contacts2 = contacts.filter((e) => e != null);
      //console.log("length after " + contacts2.length);
      const sectionData: DataAZ = { title: indexChar, data: contacts2 };
      return sectionData;
    });
    //filter out those that have empty children
    sectionDataAZ = data.filter((e) => e.data.length > 0);
    return sectionDataAZ;
  }

  function getSectionDataRanking(): DataRanking[] {
    console.log('In ranking mode');
    var indexArray = rankingArray;
    //var rankData = rankingRolodex;
    var rankData = rankingRolodex.filter((e) => e.contactTypeID == showFilterTitle());

    console.log(rankData.length);
    const data: DataRanking[] = indexArray.map((letter) => {
      const contacts = rankData.map((e) => {
        if (letter == 'Z') letter = 'A+';
        return e.ranking == letter ? e : null;
      });
      // console.log("length before " + contacts.length);
      var contacts2 = contacts.filter((e) => e != null);
      //console.log("length after " + contacts2.length);
      const sectionData: DataRanking = { title: letter, data: contacts2 };
      return sectionData;
    });
    //filter out those that have empty children
    sectionDataRanking = data.filter((e) => e.data.length > 0);

    return sectionDataRanking;
  }

  function getSectionDataGroups(): DataGroups[] {
    console.log('In group mode');
    var indexArray = indexCharArray;
    var azData = dataGroups;
    const data: DataGroups[] = indexArray.map((indexChar) => {
      const contacts = azData.map((e) => {
        if (e.groupName.substring(0, 1) == indexChar) {
          return e;
        }
        if (indexChar == '#') {
          if (!isFirstLetterAlpha(e.groupName)) {
            return e;
          }
          return null;
        }
        return null;
      });
      // console.log("length before " + contacts.length);
      var contacts2 = contacts.filter((e) => e != null);
      //console.log("length after " + contacts2.length);
      const sectionData: DataGroups = { title: indexChar, data: contacts2 };
      return sectionData;
    });

    //filter out those that have empty children
    sectionDataGroups = data.filter((e) => e.data.length > 0);

    return sectionDataGroups;
    //return data;
  }

  const ItemAZ = ({ item }: { item: RolodexDataProps }) => (
    <AtoZRow
      relFromAbove={showFilterTitle()}
      data={item}
      onPress={() => handleRowPress(azRolodex.findIndex((e) => e.id == item.id))}
      lightOrDark={lightOrDark}
    />
  );

  const ItemRanking = ({ item }: { item: RolodexDataProps }) => (
    <RankingRow
      relFromAbove={showFilterTitle()}
      data={item}
      onPress={() => handleRowPress(rankingRolodex.findIndex((e) => e.id == item.id))}
      lightOrDark={lightOrDark}
    />
  );

  const ItemGroups = ({ item }: { item: GroupsDataProps }) => (
    <GroupsRow
      data={item}
      onPress={() => handleRowPress(dataGroups.findIndex((e) => e.id == item.id))}
      lightOrDark={lightOrDark}
    />
  );

  const handleRowPress = (index: number) => {
    if (isConnected) {
      handleNavigation(index);
    } else {
      if (tabSelected != 'groups') {
        showInfoWithoutInternet(index);
      } else {
        Alert.alert('Please connect to the internet');
      }
    }
  };

  const listRefAZ = React.useRef<SectionList>(null);
  const _onPressLetterAZ = (letter: string) => {
    if (listRefAZ.current) {
      var index = sectionDataAZ.findIndex((e) => e.title == letter);
      if (index != -1) {
        listRefAZ.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: false,
        });
      }
    }
  };

  const listRefRanking = React.useRef<SectionList>(null);
  const _onPressLetterRanking = (letter: string) => {
    if (letter == 'A+') letter = 'Z';
    if (listRefRanking.current) {
      var index = sectionDataRanking.findIndex((e) => e.title == letter);
      if (index != -1) {
        listRefRanking.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: false,
        });
      }
    }
  };

  const listRefGroups = React.useRef<SectionList>(null);
  const _onPressLetterGroups = (letter: string) => {
    if (listRefGroups.current) {
      var index = sectionDataGroups.findIndex((e) => e.title == letter);
      if (index != -1) {
        listRefGroups.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: false,
        });
      }
    }
  };

  const _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 0 ? 80 : 80),

    // These three properties are optional
    getSeparatorHeight: () => 0, // The height of your separators
    getSectionHeaderHeight: () => 30, // The height of your section headers
    getSectionFooterHeight: () => 0, // The height of your section footers
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state != null && state.isConnected != null) {
        setIsConnected(state.isConnected);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function showInfoWithoutInternet(index: number) {
    var dataArray = azRolodex;
    if (tabSelected == 'ranking') {
      dataArray = rankingRolodex;
    }
    var message = '';
    var mobile = '';
    var home = '';
    var work = '';
    var address = '';
    if (dataArray[index].mobile != '' && dataArray[index].mobile != null) {
      mobile = 'Mobile: ' + dataArray[index].mobile;
      message = message + mobile + '\n';
    }
    if (dataArray[index].homePhone != '') {
      home = 'Home: ' + dataArray[index].homePhone;
      message = message + home + '\n';
    }
    if (dataArray[index].officePhone != '') {
      work = 'Office: ' + dataArray[index].officePhone;
      message = message + work + '\n';
    }
    if (dataArray[index].address.street != '' && dataArray[index].address.street != null) {
      address = dataArray[index].address.street;
      message = message + '\n' + address + '\n';
    }
    if (dataArray[index].address.street2 != '' && dataArray[index].address.street2 != null) {
      address = dataArray[index].address.street2;
      message = message + address + '\n';
    }
    if (dataArray[index].address.city != '' && dataArray[index].address.city != null) {
      address = dataArray[index].address.city;
      message = message + address + ', ';
    }
    if (dataArray[index].address.state != '' && dataArray[index].address.state != null) {
      address = dataArray[index].address.state;
      message = message + address + ' ';
    }
    if (dataArray[index].address.zip != '' && dataArray[index].address.zip != null) {
      address = dataArray[index].address.zip;
      message = message + address;
    }
    if (message != '') {
      Alert.alert(message);
    } else {
      Alert.alert('No phone number or address');
    }
  }

  function showInfoWithoutInternet2(index: number) {
    var dataArray = azRolodex;
    if (tabSelected == 'ranking') {
      dataArray = rankingRolodex;
    }
    var message = '';
    var mobile = '';
    var home = '';
    var work = '';
    var address = '';
    if (dataArray[index].mobile != '' && dataArray[index].mobile != null) {
      mobile = 'Mobile: ' + dataArray[index].mobile;
      message = message + mobile + '\n';
    }
    if (dataArray[index].homePhone != '') {
      home = 'Home: ' + dataArray[index].homePhone;
      message = message + home + '\n';
    }
    if (dataArray[index].officePhone != '') {
      work = 'Office: ' + dataArray[index].officePhone;
      message = message + work + '\n';
    }
    if (dataArray[index].address.street != '' && dataArray[index].address.street != null) {
      address = 'Address: ' + dataArray[index].address.street;
      message = message + '\n' + address + ' ';
    }
    if (dataArray[index].address.street2 != '' && dataArray[index].address.street2 != null) {
      address = dataArray[index].address.street2;
      message = message + address + ' ';
    }
    if (dataArray[index].address.city != '' && dataArray[index].address.city != null) {
      address = dataArray[index].address.city;
      message = message + address + ', ';
    }
    if (dataArray[index].address.state != '' && dataArray[index].address.state != null) {
      address = dataArray[index].address.state;
      message = message + address + ' ';
    }
    if (dataArray[index].address.zip != '' && dataArray[index].address.zip != null) {
      address = dataArray[index].address.zip;
      message = message + address;
    }
    if (message != '') {
      Alert.alert(message);
    } else {
      Alert.alert('No phone number or address');
    }
  }

  function handleNavigation(index: number) {
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
        contactId: azRolodex[index].id,
        firstName: azRolodex[index].firstName,
        lastName: azRolodex[index].lastName,
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
        setAZRolodex(rawData);
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
    if (param == 'a-z' && azRolodex.length == 0) return true;
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
    getRolodexData(type, '50000')
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          const filteredRolodex = res.data.filter((d) => typeof d.contactTypeID !== 'undefined');
          param == 'a-z' ? setAZRolodex(filteredRolodex) : setRankingRolodex(filteredRolodex);
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
    if (param == 'a-z') setIsLoadingForRolodex(value && azRolodex.length == 0);
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
              <TouchableOpacity onPress={filterPressed}>
                <View style={globalStyles.filterRow}>
                  <Text style={globalStyles.filterText}>{isFilterRel ? 'Relationships' : 'Businesses'}</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.buttonsContainer}>
              {tabSelected == 'a-z'
                ? indexCharArray.map((letter) => <Button title={letter} onPress={() => _onPressLetterAZ(letter)} />)
                : tabSelected == 'groups'
                ? indexCharArray.map((letter) => <Button title={letter} onPress={() => _onPressLetterGroups(letter)} />)
                : rankingArray.map((letter) => (
                    <Button title={letter == 'Z' ? 'A+' : letter} onPress={() => _onPressLetterRanking(letter)} />
                  ))}
            </View>

            {tabSelected == 'a-z' && (
              <View style={styles.rolodexAZ}>
                <SectionList
                  ref={listRefAZ}
                  sections={getSectionDataAZ()}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => <ItemAZ item={item} />}
                  renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionTitle}>
                      <Text style={styles.header}>{title}</Text>
                    </View>
                  )}
                  getItemLayout={_getItemLayout}
                />
              </View>
            )}

            {tabSelected == 'ranking' && (
              <View style={styles.rolodexRanking}>
                <SectionList
                  ref={listRefRanking}
                  sections={getSectionDataRanking()}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => <ItemRanking item={item} />}
                  renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionTitle}>
                      <Text style={styles.header}>{title}</Text>
                    </View>
                  )}
                  getItemLayout={_getItemLayout}
                />
              </View>
            )}

            {tabSelected == 'groups' && (
              <View style={styles.rolodexGroups}>
                <SectionList
                  ref={listRefGroups}
                  sections={getSectionDataGroups()}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => <ItemGroups item={item} />}
                  renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionTitle}>
                      <Text style={styles.header}>{title}</Text>
                    </View>
                  )}
                  getItemLayout={_getItemLayout}
                />
              </View>
            )}

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
