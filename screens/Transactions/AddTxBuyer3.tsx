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
import { styles } from './transactionHelpers';
import { storage } from '../../utils/storage';

export default function AddTxBuyer3(props: any) {
  const { route } = props;
  const {
    status,
    type,
    leadSource,
    buyer,
    address,
    street1,
    street2,
    city,
    state,
    zip,
    probability,
    closingDate,
    closingPrice,
    buyerComm,
    dOrP1,
    dOrP2,
    myGrossComm,
  } = route.params;
  const isFocused = useIsFocused();
  const [lightOrDark, setIsLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Transaction Details',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={completePressed}>
          <Text style={styles.backAndNext}>Complete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function backPressed() {
    navigation.goBack();
  }

  function completePressed() {
    navigation.navigate('RealEstateTransactions');
  }

  return <View style={styles.container}></View>;
}
