import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getGroupMembers } from './api';
import { GroupMembersDataProps } from './interfaces';
import GroupMemberRow from './GroupMemberRow';

export default function GroupMembersScreen(props: any) {
  const { route } = props;
  const { groupID, groupName } = route.params;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dataGroups, setDataGroups] = useState<GroupMembersDataProps[]>([]);
  const [search, setSearch] = useState('');
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

  function addPressed() {
    console.log('add pressed');
  }

  useEffect(() => {
    getDarkOrLightMode();
    fetchGroupMembers(groupID);
    console.log('groupID2: ' + groupID);
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function fetchGroupMembers(groupID: string) {
    setIsLoading(true);
    getGroupMembers(groupID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataGroups(res.data);
          navigation.setOptions({ title: groupName });
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
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
});
