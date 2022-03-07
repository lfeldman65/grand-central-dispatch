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
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
import styles from './styles';
import { analytics } from '../../utils/analytics';

export default function PACCallsRow(props) {
  const navigation = useNavigation();

  const handlePhonePressed = (number) => {
    console.log(number);
  };

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.personName}>{props.data.contactName}</Text>
        <Text style={styles.otherText}>{'Ranking: ' + props.data.mobile}</Text>
        <Text style={styles.otherText}>{'Last Call: ' + '08/10/2021'}</Text>
        <Text style={styles.otherText}>{props.data.notes}</Text>
      </View>
    </TouchableOpacity>
  );
}
