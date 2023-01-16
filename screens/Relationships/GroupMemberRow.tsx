import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { GroupMembersDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { removeGroupMember } from './api';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface GroupMemberRowProps {
  data: GroupMembersDataProps;
  onPress(): void;
  search: string;
  groupID: string;
  groupName: string;
  lightOrDark: string;
  refresh(): void;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  if (rank == 'C') return rankC;
  return rankD;
}

function displayName(first: string, last: string, type: string, employer: string, isAZ: boolean) {
  if (type == 'Rel') {
    return first + ' ' + last;
  }
  return employer + ' (' + first + ')';
}

export default function GroupMemberRow(props: GroupMemberRowProps) {
  const { groupID, groupName } = props;
  const [isLoading, setIsLoading] = useState(true);

  function removePressed() {
    Alert.alert(
      'Remove ' + props.data.firstName + ' ' + props.data.lastName + ' from ' + groupName + '?',
      '',
      [
        {
          text: 'Remove',
          onPress: () => removePressedContinued(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function removePressedContinued() {
    console.log('group id from above: ' + groupID);
    console.log('guid from above: ' + props.data.id);
    setIsLoading(true);
    removeGroupMember(groupID, props.data.id)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          //  navigation.goBack();
          //  console.log(res.data);
          props.refresh();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
        <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {displayName(props.data.firstName, props.data.lastName, props.data.contactTypeID, 'Motorola', true)}
        </Text>
        <View style={styles.removeView}>
          <Text onPress={removePressed} style={styles.removeButton}>
            Remove
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  removeView: {
    marginTop: 15,
    left: '80%',
    position: 'absolute',
  },
  personNameDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  personNameLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rankingCircle: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  removeButton: {
    color: 'red',
    marginRight: 80,
    fontSize: 18,
  },
});
