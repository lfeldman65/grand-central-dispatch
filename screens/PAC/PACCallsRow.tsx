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
  Animated,
  Button,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

export default function PACCallsRow(props) {
  const handlePhonePressed = (number) => {
    console.log(number);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <Button
          color="white"
          onPress={() => {
            console.log('hello');
          }}
          title="DELETE"
        ></Button>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Button
          color="white"
          onPress={() => {
            console.log(props.data.contactName);
          }}
          title="COPY"
        ></Button>
      </View>
    );
  };

  return (
    // <Swipeable
    //   enableTrackpadTwoFingerGesture
    //   leftThreshold={30}
    //   rightThreshold={40}
    //   overshootLeft={false}
    //   overshootRight={false}
    //   renderRightActions={renderRightActions}
    //   renderLeftActions={renderLeftActions}
    // >
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.personName}>{props.data.contactName}</Text>
        <Text style={styles.otherText}>{'Ranking: ' + props.data.ranking}</Text>

        <Text style={styles.otherText}>{'Last Call: ' + props.data.lastCallDate}</Text>

        {props.data.mobilePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.mobilePhone)}>
            <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobilePhone}</Text>
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
    //   </Swipeable>
  );
}
