import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AboutUsDataProps } from './interfaces';
const logo = require('../Podcasts/images/podcastMini.png');

interface AboutUsRowProps {
  data: AboutUsDataProps;
  onPress(): void;
  lightOrDark: string;
}

function modifyTitle(oldTitle: string) {
  return oldTitle;
}

function modifySubtext(oldSubtext: string) {
  return oldSubtext;
}

export default function AboutUsRow(props: AboutUsRowProps) {
  const [lightOrDark, setLightOrDark] = useState('');
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.imageBox}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <View style={styles.textBox}>
          <Text style={props.lightOrDark == 'dark' ? styles.titleTextDark : styles.titleTextLight}>
            {modifyTitle(props.data.title)}
          </Text>
          <Text style={styles.timeText}>{modifySubtext(props.data.authorName)}</Text>
        </View>

        {/* <View style={styles.chevronBox}>
          <Image source={chevron} style={styles.chevron} />
        </View> */}
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
    height: 60,
  },
  rowLight: {
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
  titleTextDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
  },
  titleTextLight: {
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
