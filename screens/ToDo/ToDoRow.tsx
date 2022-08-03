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
//import styles from './styles';
import { analytics } from '../../utils/analytics';
import { ToDoDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { prettyDate } from '../../utils/general';
const bullsEye = require('../ToDo/images/campaign.png');
const chevron = require('../../images/chevron_blue_right.png');

interface ToDoRowProps {
  data: ToDoDataProps;
  onPress(): void;
}

export default function ToDoRow(props: ToDoRowProps) {
  const isFocused = useIsFocused();
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.imageBox}>
          {props.data.isCampaign && <Image source={bullsEye} style={styles.bullsEyeImage} />}
        </View>
        <View style={lightOrDark == 'dark' ? styles.textBoxDark : styles.textBoxLight}>
          <Text style={lightOrDark == 'dark' ? styles.titleTextDark : styles.titleTextLight}>{props.data.title}</Text>
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{props.data.notes}</Text>
        </View>
        <View style={styles.dateColumn}>
          <View style={lightOrDark == 'dark' ? styles.dateViewDark : styles.dateViewLight}>
            <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
              {'Due: ' + prettyDate(props.data.dueDate)}
            </Text>
            {props.data.priority && <Text style={styles.priorityText}>High Priority</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 'auto',
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 'auto',
  },
  dateColumn: {
    flexDirection: 'column',
  },
  imageBox: {
    width: 30,
    height: 30,
    alignItems: 'center',
    paddingTop: 25,
    marginLeft: 7,
    marginRight: 7,
  },
  bullsEyeImage: {
    height: 30,
    width: 30,
  },
  textBoxDark: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'black',
    width: '62%',
    marginLeft: 5,
    textAlign: 'left',
  },
  textBoxLight: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'white',
    width: '62%',
    marginLeft: 5,
    textAlign: 'left',
  },
  titleTextDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    fontWeight: '500',
  },
  titleTextLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    fontWeight: '500',
  },
  regTextDark: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 3,
  },
  regTextLight: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 3,
  },
  dateViewDark: {
    justifyContent: 'space-between',
    marginTop: -4,
    backgroundColor: 'black',
  },
  dateViewLight: {
    justifyContent: 'space-between',
    marginTop: -4,
    backgroundColor: 'white',
  },
  chevron: {
    backgroundColor: 'white',
    height: 20,
    width: 12,
    marginTop: 15,
  },
  priorityText: {
    marginTop: 5,
    color: '#F99055',
    fontSize: 14,
  },
});
