import { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
import styles from './styles';
import { analytics } from '../../constants/analytics';

export default function PACCallsRow(props) {
  const navigation = useNavigation();
 
  const handlePhonePressed = () => {
    console.log('Phone');
  }

  function handleComplete() {
    console.log('Complete');
    analytics.event(new Event('PAC', 'Complete Pressed', 0))
  }

  function handlePostpone() {
    console.log('Postpone');
  }

  // Use Paschal case for components
  function RightButtons() {
    <View style={styles.completeView}>
      <TouchableOpacity onPress={handleComplete}>
        <Text style={styles.complete}>Complete</Text>
      </TouchableOpacity>
    </View>
  };

  function LeftButtons() {
    <View style={styles.postponeView}>
      <TouchableOpacity onPress={handlePostpone}>
        <Text style={styles.postphone}>Postpone</Text>
      </TouchableOpacity>
    </View>
  };

  // function getRanking(notes) {
  //   if (!sanityCheck())
  //     return "";

  //   console.log(notes);

  //   return notes;
  // }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.personName}>{props.data.contactName}</Text>
        <Text style={styles.otherText}>{"Ranking: " + props.data.mobile}</Text>
        <Text style={styles.otherText}>{"Last Call: " + "08/10/2021"}</Text>

        <TouchableOpacity onPress={() => handlePhonePressed()}>
          <Text style={styles.phoneNumber}>{"Mobile: " + props.data.mobile}</Text>
        </TouchableOpacity>

        <Text style={styles.phoneNumber}>{"Office: " + props.data.officePhone}</Text>


        <Text style={styles.phoneNumber}>{"Home: " + props.data.homePhone}</Text>


      </View>
    </TouchableOpacity>
  );
}

