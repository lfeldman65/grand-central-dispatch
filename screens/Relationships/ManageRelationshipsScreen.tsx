import { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
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
import { ga4Analytics } from '../../utils/general';

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
  const [lightOrDark, setLightOrDark] = useState('');

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
    showFilterTitle();
    if (tabSelected == 'a-z') {
      fetchRolodexPressed('alpha', true);
    } else if (tabSelected == 'ranking') {
      fetchRolodexPressed('ranking', true);
    } else {
      fetchGroupsPressed(true);
    }
  }, [isFilterRel]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Relationships',
      headerLeft: () => <MenuIcon />,
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
      // these seem backwards, but it's because we are sending the analytics before toggling.
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

  function fetchRolodexPressed(type: string, isMounted: boolean) {
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
          //  console.log(res.data);
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
          //  console.log(res.data);
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

            <ScrollView>
              {tabSelected == 'a-z' && (
                <View>
                  {dataRolodex.map((item, index) => (
                    <AtoZRow
                      relFromAbove={showFilterTitle()}
                      key={index}
                      data={item}
                      onPress={() => handleRowPress(index)}
                      lightOrDark={lightOrDark}
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
                      lightOrDark={lightOrDark}
                    />
                  ))}
                </View>
              )}
              {tabSelected == 'groups' && (
                <View>
                  {dataGroups.map((item, index) => (
                    <GroupsRow
                      key={index}
                      data={item}
                      lightOrDark={lightOrDark}
                      onPress={() => handleRowPress(index)}
                    />
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
    </>
  );
}
