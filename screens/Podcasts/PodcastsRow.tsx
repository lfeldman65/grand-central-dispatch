import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { PodcastDataProps } from './interfaces';
import { makeLongTxtPretty } from '../../utils/general';

const logo = require('../Podcasts/images/podcastMini.png');

interface PodcastsRowProps {
  data: PodcastDataProps;
  onPress(): void;
  lightOrDark: string;
}

function getLine1(title: string) {
  var titleParts = title.split(':');
  return titleParts[0] + ':' + titleParts[1];
}

function getLine2(title: string) {
  let deviceWidth = Dimensions.get('window').width;
  //  console.log(deviceWidth);
  var titleParts = title.split(':');
  var charLimit = -0.66 * deviceWidth + 60;
  //  console.log(charLimit);
  return makeLongTxtPretty(titleParts[2].trim(), 80);
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

function pad0IfNeeded(part: string) {
  if (part.length < 2) {
    return '0' + part;
  }
  return part;
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
            {getLine2(props.data.title)}
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
