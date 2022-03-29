import { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Button from '../../components/Button';
import AddRelScreen from './AddRelationshipScreen';

import AtoZRow from './AtoZRow';
import RankingRow from './RankingRow';
import GroupsRow from './GroupsRow';

import { getGroupsData, getRolodexData } from './api';
import { GroupsDataProps, RolodexDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import styles2 from './styles';

import { analytics } from '../../utils/analytics';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';

type TabType = 'a-z' | 'ranking' | 'groups';

// interface RolodexScreenProps {
//   route: RouteProp<any>;
// }

//export default function ManageRelationshipsScreen(props: RolodexScreenProps) {
export default function ManageRelationshipsScreen() {
  let deviceWidth = Dimensions.get('window').width;

  // const [tabSelected, setTabSelected] = useState(props.route.params?.defaultTab ?? 'A-Z');
  const [tabSelected, setTabSelected] = useState<TabType>('a-z');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]); // A-Z and Ranking tabs
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    console.log('rolodex row press');
    analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));

    // navigation.navigate('RelationshipDetailScreen', {});
    // navigation.navigate('RelationshipDetailScreen', {
    //   //  contactId: data[index]['contactId'],
    // });
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      tab: tabSelected,
    });
  }, []);

  useEffect(() => {
    if (tabSelected != 'groups') {
      fetchRolodexPressed(tabSelected);
    } else {
      fetchGroupsPressed(tabSelected);
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({ title: 'Add Relationship' });
    fetchRolodexPressed('a-z');
    console.log('a-z');
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
    <View style={styles.container}>
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
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <React.Fragment>
          {tabSelected != 'groups' && (
            <View style={styles.filterButton}>
              <TouchableOpacity onPress={filterPressed}>
                <Text style={styles.filterText}>{isFilterRel ? 'Show Businesses' : 'Show Relationships'}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  spacing: {
    color: 'white',
    backgroundColor: 'white',
  },
  invisible: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  chevron: {
    marginRight: 20,
    marginTop: 5,
    height: 15,
    width: 27,
  },
  filterButton: {
    height: 40,
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 18,
    color: '#1C6597',
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 10,
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  addText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
  },
});
