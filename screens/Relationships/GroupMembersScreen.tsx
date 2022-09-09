import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Modal,
} from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getGroupMembers, getGroupMembersSearch, addRelToGroup } from './api';
import { GroupMembersDataProps } from './interfaces';
import GroupMemberRow from './GroupMemberRow';
import SelRelScreen from './SelectRelationshipScreen';
import { RolodexDataProps } from './interfaces';

const closeButton = require('../../images/button_close_white.png');
const searchGlass = require('../../images/whiteSearch.png');

export default function GroupMembersScreen(props: any) {
  const { route } = props;
  const { groupID, groupName } = route.params;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dataGroups, setDataGroups] = useState<GroupMembersDataProps[]>([]);
  const [search, setSearch] = useState('');
  const [relModalVisible, setRelModalVisible] = useState(false);
  const [member, setMember] = useState<RolodexDataProps>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => <Button color="#fff" onPress={() => addPressed()} title="Add" />,
    });
  }, [navigation]);

  const handleRowPress = (index: number) => {
    navigation.navigate('RelDetails', {
      contactId: dataGroups[index].id,
      firstName: dataGroups[index].firstName,
      lastName: dataGroups[index].lastName,
    });
  };

  function clearSearchPressed() {
    setSearch('');
  }

  useEffect(() => {
    console.log('group:' + groupID);
    console.log('set member:' + member?.id);
    if (member != null) {
      addRelationshipToGroup(member?.id!, groupID);
    }
  }, [member]);

  function addRelationshipToGroup(guid: string, groupID: string) {
    setIsLoading(true);
    addRelToGroup(groupID, guid)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log('group name: ' + groupName);
          console.log('group id: ' + groupID);
          navigation.setOptions({ title: groupName });
          fetchGroupMembers(groupID, true);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function addPressed() {
    setRelModalVisible(true);
  }

  useEffect(() => {
    let isMounted = true;
    if (search != '') {
      fetchGroupMembersSearch(groupID, search, isMounted);
    } else {
      fetchGroupMembers(groupID, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    fetchGroupMembers(groupID, isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function fetchGroupMembersSearch(groupID: string, searchParam: string, isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    setIsLoading(true);
    getGroupMembersSearch(groupID, searchParam)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataGroups(res.data);
          console.log('group name: ' + groupName);
          console.log('group id: ' + groupID);
          navigation.setOptions({ title: groupName });
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchGroupMembers(groupID: string, isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    setIsLoading(true);
    getGroupMembers(groupID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataGroups(res.data);
          //   console.log(res.data);
          navigation.setOptions({ title: groupName });
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
      <View style={styles.searchView}>
        <Image source={searchGlass} style={styles.magGlass} />

        <TextInput
          style={styles.textInput}
          placeholder="Search By Name or Address"
          placeholderTextColor="white"
          textAlign="left"
          defaultValue={search}
          onChangeText={(text) => setSearch(text)}
        />

        <TouchableOpacity onPress={clearSearchPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <ScrollView>
          <View>
            {dataGroups.map((item, index) => (
              <GroupMemberRow
                groupID={groupID}
                groupName={groupName}
                search={search}
                key={index}
                data={item}
                onPress={() => handleRowPress(index)}
              />
            ))}
          </View>

          {relModalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={relModalVisible}
              onRequestClose={() => {
                setRelModalVisible(!relModalVisible);
              }}
            >
              <SelRelScreen title={'Select Referral'} setReferral={setMember} setModalVisible={setRelModalVisible} />
            </Modal>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchView: {
    backgroundColor: '#1a6295',
    height: 40,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 300,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeX: {
    width: 15,
    height: 15,
    marginRight: -10,
    marginTop: 12,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: -10,
    marginTop: 1,
  },
  magGlass: {
    width: 20,
    height: 20,
    marginLeft: -20,
    marginTop: 8,
  },
  pageTitle: {
    color: 'white',
    fontSize: 18,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 30,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  notesText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  inputViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInputDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  textInputLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
