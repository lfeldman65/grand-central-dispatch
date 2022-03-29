import { useState } from 'react';
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
  TouchableHighlight,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
//import Swipeable from 'react-native-swipeable-row';
//import styles from './styles';
import { analytics } from '../../utils/analytics';
import { RecentActivityDataProps } from './interfaces';
const callImage = require('../Relationships/images/recentCall.png');
const noteImage = require('../Relationships/images/recentNote.png');
const otherImage = require('../Relationships/images/recentOther.png');
const popImage = require('../Relationships/images/recentPop.png');
const referralImage = require('../Relationships/images/recentReferral.png');

interface RecentActivityRowProps {
  data: RecentActivityDataProps;
  onPress(): void;
}

function chooseImage(activityType: string) {
  console.log(activityType);
  if (activityType == 'callMade') return callImage;
  if (activityType == 'noteWritten') return noteImage;
  if (activityType == 'popByMade') return popImage;
  if (activityType == 'referralGiven') return referralImage;
  if (activityType == 'otherActivity') return otherImage;
  return otherImage;
}

function displayName(first: string, last: string, type: string, employer: string, isAZ: boolean) {
  if (type == 'Rel') {
    return first + ' ' + last;
  }
  return employer + ' (' + first + ')';
}

export default function RecentActivityRow(props: RecentActivityRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Image source={chooseImage(props.data.ActivityType)} style={styles.recentImage} />
        <Text style={styles.personName}>{props.data.Name}</Text>
        <Text style={styles.personName}>{props.data.ActivityType}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    alignItems: 'center',
  },
  personName: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  recentImage: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
  },
});
