import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps, AttendeesProps } from '../ToDo/interfaces';
import {
  AddTxBuyerAndSellerSheets,
  statusMenu,
  propertyAddressMenu,
  leaseOrRefFeeMenu,
  styles,
} from './transactionHelpers';
import Attendees from '../ToDo/AttendeesScreen';

const closeButton = require('../../images/button_close_white.png');

export default function AddOrEditOtherTx1() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Other Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={nextPressed}>
          <Text style={styles.backAndNext}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
    navigation.navigate('AddOrEditOtherTx2');
  }

  return <ScrollView style={styles.container}></ScrollView>;
}
