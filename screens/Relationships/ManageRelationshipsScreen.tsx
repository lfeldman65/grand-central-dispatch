import { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Button from '../../components/Button';

import AtoZRow from './AtoZRow';
import RankingRow from './RankingRow';
import GroupsRow from './GroupsRow';

import { getGroupsData, getRolodexData } from './api';
import { GroupsDataProps, RolodexDataProps } from './interfaces';
import styles2 from './styles';

const chevron = require('../../images/chevron_blue.png');
import { analytics } from '../../utils/analytics';
import React from 'react';

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

  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [dataGroups, setDataGroups] = useState<GroupsDataProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    // navigation.navigate('PACDetail', {
    //   contactId: data[index]['contactId'],
    //   type: data[index]['type'],
    //   ranking: data[index]['ranking'],
    //   lastCallDate: data[index]['lastCallDate'],
    //   lastNoteDate: data[index]['lastNoteDate'],
    //   lastPopByDate: data[index]['lastPopByDate'],
    // });
    console.log('rolodex row press');
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, []);

  useEffect(() => {
    fetchRolodexPressed(tabSelected);
  }, [isFocused]);

  useEffect(() => {
    showFilterTitle();
  }, [isFilterRel]);

  function showFilterTitle() {
    if (isFilterRel) {
      return 'Relationships';
    }
    return 'Businesses';
  }

  function handleAddRelPressed() {
    console.log('Add Rel Pressed');
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
          console.log(res);
          setDataGroups(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabButtonRow}>
        <Text style={tabSelected == 'a-z' ? styles.selected : styles.unselected} onPress={azPressed}>
          A-Z
        </Text>
        <Text style={tabSelected == 'ranking' ? styles.selected : styles.unselected} onPress={rankingPressed}>
          Ranking
        </Text>
        <Text style={tabSelected == 'groups' ? styles.selected : styles.unselected} onPress={groupsPressed}>
          Groups
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <React.Fragment>
          <View style={styles.filterBox}>
            <TouchableOpacity onPress={filterPressed}>
              <Text style={styles.spacing}>spacing</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={filterPressed}>
              <Text style={styles.filterText}>{isFilterRel ? 'Relationships' : 'Businesses'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={filterPressed}>
              <Image source={chevron} style={styles.chevron} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {tabSelected == 'a-z' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <AtoZRow key={index} data={item} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            )}
            {tabSelected == 'ranking' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <RankingRow key={index} data={item} onPress={() => handleRowPress(index)} />
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
          <TouchableOpacity style={styles.bottomContainer} onPress={() => handleAddRelPressed()}>
            <View style={styles2.ideasButton}>
              <Text style={styles2.ideasText}>{'Add Relationship'}</Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
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
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 18,
    color: 'black',
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
