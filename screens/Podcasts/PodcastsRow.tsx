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
import { PodcastDataProps } from './interfaces';
const logo = require('../Podcasts/images/podcastMini.png');
//const chevron = require('../../images/chevron_blue_right.png');

interface PodcastsRowProps {
  data: PodcastDataProps;
  onPress(): void;
}

function makeTitlePretty(title: string) {
  if (title.length < 40) {
    return title;
  }
  return title.substring(0, 40) + '...';
}

function makeTimePretty(duration: number) {
  var hrs = 0;
  var hrsFloor = 0;
  var min = 0;
  var minFloor = 0;
  var sec = 0;

  hrs = duration / 3600;
  hrsFloor = Math.floor(hrs);
  duration = duration - hrsFloor * 3600;
  min = duration / 60;
  minFloor = Math.floor(min);
  duration = duration - minFloor * 60;
  sec = duration;

  return (
    pad0IfNeeded(hrsFloor.toString()) + ':' + pad0IfNeeded(minFloor.toString()) + ':' + pad0IfNeeded(sec.toString())
  );
}

function makeTimePretty2(duration: number) {
  duration = 3601;
  if (duration == 3600) {
    return '01:00:00';
  }
  if (duration == 7200) {
    return '02:00:00';
  }
  var hrs = 0;
  var hrsFloor = 0;
  var min = 0;
  var minFloor = 0;
  var sec = 0;

  hrs = duration / 3600.0;
  hrsFloor = Math.floor(hrs);
  console.log(hrs);

  duration = duration % 3600;
  hrs = Math.floor(duration / 3600);
  duration = duration % 3600;
  min = duration / 60;
  minFloor = Math.floor(min);
  duration = duration % 60;
  sec = duration;

  return pad0IfNeeded(hrs.toString()) + ':' + pad0IfNeeded(minFloor.toString()) + ':' + pad0IfNeeded(sec.toString());
}

function pad0IfNeeded(part: string) {
  if (part.length < 2) {
    return '0' + part;
  }
  return part;
}

export default function PodcastsRow(props: PodcastsRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.imageBox}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.titleText}>{makeTitlePretty(props.data.title)}</Text>
          <Text style={styles.timeText}>{makeTimePretty(props.data.duration)}</Text>
        </View>

        {/* <View style={styles.chevronBox}>
          <Image source={chevron} style={styles.chevron} />
        </View> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingTop: 5,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.25,
    height: 60,
  },
  imageBox: {
    alignItems: 'center',
    paddingTop: 10,
    marginLeft: 7,
    marginRight: 7,
  },
  logoImage: {
    height: 30,
    width: 30,
  },
  textBox: {
    flexDirection: 'column',
    height: 75,
    width: '85%',
    marginLeft: 5,
    textAlign: 'left',
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
  },
  timeText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 3,
  },
  chevronBox: {
    paddingTop: 1,
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
