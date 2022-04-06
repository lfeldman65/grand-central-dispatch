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
import { ToDoDataProps } from './interfaces';
const bullsEye = require('../ToDo/images/campaign.png');
const chevron = require('../../images/chevron_blue_right.png');

interface ToDoRowProps {
  data: ToDoDataProps;
  onPress(): void;
}

function prettyDate(uglyDate: string) {
  var dateOnly = uglyDate.substring(0, 10);
  var dateParts = dateOnly.split('-');
  console.log(dateParts[0]);
  var year = dateParts[0].substring(2, 4);
  return 'Due: ' + dateParts[1] + '/' + dateParts[2] + '/' + year;
}

export default function ToDoRow(props: ToDoRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.imageBox}>
          {props.data.isCampaign && <Image source={bullsEye} style={styles.bullsEyeImage} />}
        </View>
        <View style={styles.textBox}>
          <Text style={styles.titleText}>{props.data.title}</Text>
          <Text style={styles.regText}>{props.data.notes}</Text>
        </View>
        <View style={styles.dateView}>
          <Text style={styles.regText}>{prettyDate(props.data.dueDate)}</Text>
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
    height: 'auto',
  },
  imageBox: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 25,
    marginLeft: 7,
    marginRight: 7,
  },
  bullsEyeImage: {
    height: 30,
    width: 30,
    //  marginLeft: 15,
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
    width: '62%',
    marginLeft: 5,
    textAlign: 'left',
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    fontWeight: '500',
  },
  regText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 3,
  },
  dateView: {
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
});
