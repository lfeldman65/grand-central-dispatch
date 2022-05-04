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

function makeTextPretty(name: string, count: number) {
  if (count == 1) {
    return '"' + name + '" has been watched 1 time';
  }
  return '"' + name + '" has been watched 1 times';
}

export default function VideoHistoryRow(props: VideoHistoryRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.textBox}>
          <Text style={styles.activityText}>{makeTextPretty(props.data.videoTitle, props.data.viewCount)}</Text>
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
    height: 60,
  },
  textBox: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'white',
    width: '88%',
    marginLeft: 5,
    textAlign: 'left',
  },
  activityText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 14,
  },
  chevronBox: {
    paddingTop: 10,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 20,
  },
  chevron: {
    backgroundColor: 'white',
    height: 20,
    width: 12,
  },
});
