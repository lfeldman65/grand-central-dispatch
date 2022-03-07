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
import Swipeable from 'react-native-swipeable-row';
import styles from './styles';
import { analytics } from '../../constants/analytics';
import * as SMS from 'expo-sms';

export default function PACPopRow(props) {
  function handlePhonePressed(number) {
    console.log(number);
    Linking.openURL(`tel:${number}`);
  }

  function handleText(number) {
    console.log(number);
    if (SMS.isAvailableAsync()) {
      const { result } = SMS.sendSMSAsync(['8478774043'], 'My sample HelloWorld message');
    } else {
    }
  }

  function handleDirectionsPressed() {
    console.log('directions');
  }

  function handleSavedPressed() {
    console.log('saved');
  }

  function handlePopPressed() {
    console.log('pop');
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.row1}>
          <Text style={styles.personName}>{props.data.contactName}</Text>
          <TouchableOpacity style={styles.phoneRow} onPress={() => handleDirectionsPressed()}>
            <Text style={styles.phoneNumber}>{'Directions'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <Text style={styles.otherText}>{'Ranking: ' + props.data.mobile}</Text>
          <TouchableOpacity style={styles.phoneRow} onPress={() => handleSavedPressed()}>
            <Text style={styles.phoneNumber}>{'Saved'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <Text style={styles.otherText}>{'Last PopBy: ' + '08/10/2021'}</Text>
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePopPressed()}>
            <Text style={styles.phoneNumber}>{'Pop-By Map'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.otherText}>{props.data.notes}</Text>

        {props.data.mobile != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.mobile)}>
            <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobile}</Text>
          </TouchableOpacity>
        )}

        {props.data.officePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.officePhone)}>
            <Text style={styles.phoneNumber}>{'Office: ' + props.data.officePhone}</Text>
          </TouchableOpacity>
        )}

        {props.data.homePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.homePhone)}>
            <Text style={styles.phoneNumber}>{'Home: ' + props.data.homePhone}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
