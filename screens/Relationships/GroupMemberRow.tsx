import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { GroupMembersDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface GroupRowProps {
  data: GroupMembersDataProps;
  onPress(): void;
  search: string;
  groupID: string;
  groupName: string;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  if (rank == 'C') return rankC;
  return rankD;
}

function displayName(first: string, last: string) {
  return first + ' ' + last;
}

export default function GroupMemberRow(props: GroupRowProps) {
  const { groupID, groupName } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    getDarkOrLightMode();
    console.log('group name ya: ' + groupName);
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function removePressed() {
    console.log('remove pressed');
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
        <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {displayName(props.data.firstName, props.data.lastName)}
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
