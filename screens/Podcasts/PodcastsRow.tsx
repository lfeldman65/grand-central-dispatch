import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { PodcastDataProps } from './interfaces';
import { makeLongTxtPretty } from '../Calendar/calendarHelpers';
import { getLine1, getLine2, makeTimePretty } from './podcastHelpers';

const logo = require('../Podcasts/images/podcastMini.png');

interface PodcastsRowProps {
  data: PodcastDataProps;
  onPress(): void;
  lightOrDark: string;
}

export default function PodcastsRow(props: PodcastsRowProps) {
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.imageBox}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <View style={styles.textBox}>
          <View style={styles.line1}>
            <Text style={props.lightOrDark == 'dark' ? styles.titleTextDark : styles.titleTextLight}>
              {getLine1(props.data.title)}
            </Text>
            <Text style={styles.timeText}>{makeTimePretty(props.data.duration)}</Text>
          </View>
          <Text style={props.lightOrDark == 'dark' ? styles.title2TextDark : styles.title2TextLight}>
            {makeLongTxtPretty(getLine2(props.data.title), 80)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 5,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.25,
    height: 120,
    justifyContent: 'center',
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 5,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.25,
    height: 120,
    justifyContent: 'center',
  },
  imageBox: {
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7,
    justifyContent: 'center',
  },
  logoImage: {
    height: 30,
    width: 30,
  },
  line1: {
    flexDirection: 'row',
  },
  textBox: {
    marginTop: 10,
    flexDirection: 'column',
    width: '85%',
    marginLeft: 5,
    textAlign: 'left',
  },
  titleTextDark: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
  },
  titleTextLight: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
  },
  title2TextDark: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
  },
  title2TextLight: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
  },
  timeText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 5,
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
