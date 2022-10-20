import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddTxBuyerAndSellerSheets, probabilityMenu, styles } from './transactionHelpers';
import { storage } from '../../utils/storage';

export default function AddOrEditOtherTx2() {
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
    navigation.navigate('RealEstateTransactions');
  }

  return <View style={styles.container}></View>;
}
