import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import AddRelScreen from './AddRelationshipScreen';
import AtoZRow from './AtoZRow';
import RankingRow from './RankingRow';
import GroupsRow from './GroupsRow';
import { getGroupsData, getRolodexData } from './api';
import { GroupsDataProps, RolodexDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { storage } from '../../utils/storage';
const chevron = require('../../images/chevron_blue.png');

type TabType = 'a-z' | 'ranking' | 'groups';

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('a-z');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]); // A-Z and Ranking tabs
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  const handleRowPress = (index: number) => {
    console.log('rolodex row press');
    analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    navigation.navigate('RelDetails', {
      contactId: dataRolodex[index]['id'],
    });
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      tab: tabSelected,
    });
  }, []);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    if (tabSelected != 'groups') {
      fetchRolodexPressed(tabSelected);
    } else {
      fetchGroupsPressed(tabSelected);
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({ title: 'Relationships' });
    fetchRolodexPressed(tabSelected);
    console.log(tabSelected);
  }, [isFilterRel]);

  useEffect(() => {
    showFilterTitle();
  }, [isFilterRel]);

  useEffect(() => {}); // this will run on every rendeer

  function showFilterTitle() {
    if (isFilterRel) {
      return 'Rel';
    }
    return 'Biz';
  }

  function handleAddRelPressed() {
    analytics.event(new Event('Relationships', 'Add Relationship', 'Press', 0));
    setModalVisible(true);
  }

  function azPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'A-Z', 0));
    setTabSelected('a-z');
    fetchRolodexPressed('alpha');
  }

  function rankingPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    setTabSelected('ranking');
    fetchRolodexPressed('ranking');
  }

  function groupsPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    setTabSelected('groups');
    fetchGroupsPressed('groups');
  }

  function filterPressed() {
    console.log('filter');
    analytics.event(new Event('Manage Relationships', 'Filter', 'Press', 0));
    if (isFilterRel) {
      setIsFilterRel(false);
    } else {
      setIsFilterRel(true);
      showFilterTitle();
    }
  }

  function fetchRolodexPressed(type: string) {
    setIsLoading(true);
    getRolodexData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchGroupsPressed(type: string) {
    setIsLoading(true);
    getGroupsData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataGroups(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function saveComplete() {
    console.log('Save Complete');
  }

  return (
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
        <Text style={tabSelected == 'groups' ? globalStyles.selected : globalStyles.unselected} onPress={groupsPressed}>
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
              <Text style={globalStyles.blankButton}></Text>
              <TouchableOpacity onPress={filterPressed}>
                <Text style={globalStyles.filterText}>{isFilterRel ? 'Show Businesses' : 'Show Relationships'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={filterPressed}>
                <Image source={chevron} style={globalStyles.chevronFilter} />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView>
            {tabSelected == 'a-z' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <AtoZRow
                    relFromAbove={showFilterTitle()}
                    key={index}
                    data={item}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            )}
            {tabSelected == 'ranking' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <RankingRow
                    relFromAbove={showFilterTitle()}
                    key={index}
                    data={item}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            )}
            {tabSelected == 'groups' && (
              <View>
                {dataGroups.map((item, index) => (
                  <GroupsRow key={index} data={item} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            )}
          </ScrollView>
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
  );
}
