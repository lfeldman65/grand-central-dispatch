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
import { styles, roundToInt } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditTransaction } from './api';

var incomeAfterCosts = 0;

export default function PurchaseLoanOrRefinance3(props: any) {
  const { route } = props;
  const {
    status,
    type,
    street1,
    street2,
    city,
    state,
    zip,
    leadSource,
    probability,
    applicationDate,
    closingDate,
    closingPrice,
    interestRate,
    rateType, // Loan Type in app
    rateTypeDesc, // Loan Description in app
    originationFees,
    dOrPOriginationFees,
    buyerCommission,
    dOrPBuyerCommission,
    additionalIncome,
    dOrPAdditionalIncome,
    borrower,
    seller,
    myGrossComm,
  } = route.params;
  const isFocused = useIsFocused();
  const [dollarOrPercentB4, setDollarOrPercentB4] = useState('percent');
  const [dollarOrPercentAfter, setDollarOrPercentAfter] = useState('dollar');
  const [miscBeforeFees, setMiscBeforeFees] = useState('10');
  const [myPortion, setMyPortion] = useState('50');
  const [miscAfterFees, setMiscAfterFees] = useState('250');
  const [notes, setNotes] = useState('');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Lender Transaction',
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
  }, [navigation, dollarOrPercentB4, dollarOrPercentAfter, miscBeforeFees, myPortion, miscAfterFees, notes]);

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
    console.log('complete pressed');
  }

  return <View style={styles.container}></View>;
}
