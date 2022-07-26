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

  function prettyDate(uglyDate: string) {
    console.log(uglyDate);
    if (uglyDate == null) return ' ';
    if (uglyDate == '') return ' ';
    var dateOnly = uglyDate.substring(0, 10);
    var dateParts = dateOnly.split('-');
    var year = dateParts[0].substring(2, 4);
    return dateParts[1] + '/' + dateParts[2] + '/' + year;
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.textBox}>
          <Text style={lightOrDark == 'dark' ? styles.nameTextDark : styles.nameTextLight}>
            {props.data.fullName + ' watched this video'}
          </Text>
          <Text style={styles.dateText}>{prettyDate(props.data.dateViewed)}</Text>
        </View>

        <View style={styles.chevronBox}>
          <Image source={chevron} style={styles.chevron} />
        </View>
      </View>
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
