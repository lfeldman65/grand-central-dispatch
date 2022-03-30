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
const chevron = require('../../images/chevron_blue_right.png');

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

function prettyType(uglyType: string) {
  if (uglyType == 'callMade') return 'Calls';
  if (uglyType == 'noteWritten') return 'Notes';
  if (uglyType == 'popByMade') return 'Pop-By';
  if (uglyType == 'referralGiven') return 'Referral';
  if (uglyType == 'otherActivity') return 'Other';
  return otherImage;
}

export default function RecentActivityRow(props: RecentActivityRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.imageBox}>
          <Image source={chooseImage(props.data.ActivityType)} style={styles.recentImage} />
          <Text style={styles.activityText}>{prettyType(props.data.ActivityType)}</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.nameText}>{props.data.Name}</Text>
          <Text style={styles.regText}>{' ' + props.data.ActivityDate}</Text>
          <Text style={styles.regText}>{props.data.Notes}</Text>
        </View>
        <View style={styles.chevronBox}>
          <Image source={chevron} style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  imageBox: {
    flexDirection: 'column',
    width: 70,
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 10,
  },
  recentImage: {
    height: 30,
    width: 30,
    marginLeft: 15,
    marginRight: 5,
    alignItems: 'center',
  },
  activityText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 5,
  },
  textBox: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'white',
    width: '70%',
    marginLeft: 5,
    textAlign: 'left',
  },
  nameText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 5,
    fontWeight: '500',
  },
  regText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 5,
  },
  chevronBox: {
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: 'white',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  chevron: {
    backgroundColor: 'white',
    height: 20,
    width: 12,
    marginTop: 15,
  },
});
