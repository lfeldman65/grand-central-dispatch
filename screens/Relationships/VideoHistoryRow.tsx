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
import { VideoSummaryDataProps } from './interfaces';
const chevron = require('../../images/chevron_blue_right.png');

interface VideoHistoryRowProps {
  data: VideoSummaryDataProps;
  onPress(): void;
}

export default function VideoHistoryRow(props: VideoHistoryRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.imageBox}>
          <Text style={styles.activityText}>{props.data.videoTitle}</Text>
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
