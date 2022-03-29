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
import MenuIcon from '../../components/MenuIcon';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import { PACDataProps } from './interfaces';

interface PACRowProps {
  data: PACDataProps;
  onPress(): void;
}

export default function PACCallsRow(props: PACRowProps) {
  const handlePhonePressed = (number: string) => {
    console.log(number);
  };

  return (
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
  );
}
