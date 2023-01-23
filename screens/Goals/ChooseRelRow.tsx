import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { RolodexDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface AtoZRowProps {
  data: RolodexDataProps;
  onPress(): void;
  lightOrDark: string;
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

export default function ChooseRelRow(props: AtoZRowProps) {
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
        <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {displayName(
            props.data.firstName,
            props.data.lastName,
            props.data.contactTypeID,
            props.data.employerName,
            true
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
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
});
