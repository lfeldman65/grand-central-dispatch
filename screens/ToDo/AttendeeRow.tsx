import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { RolodexDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface AtoZRowProps {
  data: RolodexDataProps;
  onPress(): void;
  relFromAbove: string;
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

export default function AttendeeRow(props: AtoZRowProps) {
  // const { lightOrDark } = props;
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
        <View style={styles.checkView}>
          <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
            size={25}
            textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
            fillColor="#37C0FF"
            unfillColor="white"
            iconStyle={{ borderColor: 'gray' }}
            text=""
            textContainerStyle={{ marginLeft: 10 }}
            onPress={(isChecked: boolean) => {
              console.log(isChecked);
              props.data.selected = isChecked;
            }}
          />
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
  checkView: {
    marginTop: 12,
    left: '90%',
    position: 'absolute',
    marginBottom: 12,
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
});
