import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useEffect } from 'react';
import { analytics } from '../../utils/analytics';
import { VideoDetailsDataProps } from './interfaces';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';

const chevron = require('../../images/chevron_blue_right.png');

interface VideoDetailsRowProps {
  data: VideoDetailsDataProps;
  onPress(): void;
}

export default function VideoDetailRows(props: VideoDetailsRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  rowLight: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  textBox: {
    flexDirection: 'column',
    height: 75,
    width: '88%',
    marginLeft: 5,
    textAlign: 'left',
  },
  nameTextDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 15,
  },
  nameTextLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 15,
  },
  dateText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 10,
  },
  chevronBox: {
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 20,
  },
  chevron: {
    height: 20,
    width: 12,
  },
});
