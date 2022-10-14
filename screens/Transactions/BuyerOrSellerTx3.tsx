import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { styles, roundToInt } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditTransaction } from './api';

var incomeAfterCosts = 0;

export default function BuyerOrSellerTx3(props: any) {
  const { route } = props;
  const {
    status,
    type,
    buyerLeadSource,
    sellerLeadSource,
    buyer,
    seller,
    street1,
    street2,
    city,
    state,
    zip,
    country,
    probability,
    originalDate,
    originalPrice,
    closingDate,
    closingPrice,
    buyerComm,
    sellerComm,
    dOrPBuyerComm,
    dOrPSellerComm,
    addIncome,
    dOrPAddIncome,
    myGrossComm,
  } = route.params;
  const isFocused = useIsFocused();
  const [dollarOrPercentB4, setDollarOrPercentB4] = useState('dollar');
  const [miscBeforeFees, setMiscBeforeFees] = useState(''); // 2000
  const [myPortion, setMyPortion] = useState('50'); // 50
  const [miscAfterFees, setMiscAfterFees] = useState(''); // 1500
  const [dollarOrPercentAfter, setDollarOrPercentAfter] = useState('dollar');
  const [notes, setNotes] = useState('');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Real Estate Transaction',
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
  }, [navigation, notes, seller, buyer]);

  useEffect(() => {
    calculateIncome();
    console.log('SELLER COMM: ' + sellerComm);
  }, [isFocused]);

  useEffect(() => {
    calculateIncome();
  }, [dollarOrPercentB4, dollarOrPercentAfter, miscBeforeFees, myPortion, miscAfterFees]);

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
    console.log('CLOSING DATE: ' + closingDate);
    addOrEditTransaction(
      0,
      type,
      status,
      'title',
      street1,
      street2,
      city,
      state,
      zip,
      country,
      buyerLeadSource,
      sellerLeadSource,
      probability,
      originalDate,
      closingDate, //  Test value '2016-05-25T00:00:000Z'
      originalPrice,
      closingPrice, // 400000
      '', // rate type
      miscBeforeFees, // 2000
      dollarOrPercentB4,
      miscAfterFees, // 1500
      dollarOrPercentAfter, // dollar
      myPortion, // 50
      'percent',
      myGrossComm,
      calculateIncome() ?? '0',
      addIncome,
      dOrPAddIncome,
      '0',
      '',
      buyerComm,
      dOrPBuyerComm,
      sellerComm,
      dOrPSellerComm,
      notes,
      buyer,
      seller
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log('here ' + res.data.id);
          navigation.navigate('RealEstateTransactions');
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function miscBeforeDollarOrPercentPressed() {
    if (dollarOrPercentB4 == 'percent') {
      setDollarOrPercentB4('dollar');
    } else {
      setDollarOrPercentB4('percent');
    }
  }

  function miscAfterDollarOrPercentPressed() {
    if (dollarOrPercentAfter == 'percent') {
      setDollarOrPercentAfter('dollar');
    } else {
      setDollarOrPercentAfter('percent');
    }
  }

  function calculateIncome() {
    try {
      var beforeSplitFees = 0;
      var myPortionOfSplit = 0;
      var afterSplitFees = 0;
      incomeAfterCosts = myGrossComm;
      if (miscBeforeFees == '' || miscBeforeFees == null) {
        beforeSplitFees = 0;
      } else {
        beforeSplitFees = parseFloat(miscBeforeFees);
      }
      if (myPortion == '' || myPortion == null) {
        myPortionOfSplit = 0;
      } else {
        myPortionOfSplit = parseFloat(myPortion);
      }
      if (miscAfterFees == '' || miscAfterFees == null) {
        afterSplitFees = 0;
      } else {
        afterSplitFees = parseFloat(miscAfterFees);
      }
      if (dollarOrPercentB4 == 'dollar') {
        incomeAfterCosts = incomeAfterCosts - beforeSplitFees;
      } else {
        incomeAfterCosts = incomeAfterCosts - (myGrossComm * beforeSplitFees) / 100;
      }
      incomeAfterCosts = (incomeAfterCosts * myPortionOfSplit) / 100;
      if (dollarOrPercentAfter == 'dollar') {
        incomeAfterCosts = incomeAfterCosts - afterSplitFees;
      } else {
        incomeAfterCosts = incomeAfterCosts - (incomeAfterCosts * afterSplitFees) / 100;
      }
      return '$' + roundToInt(incomeAfterCosts.toString()); // Should be $57500 with test values
    } catch {
      console.log('error');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <Text style={styles.nameTitle}>Misc Before-Split Fees</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.dollarView}>
                <Text
                  onPress={miscBeforeDollarOrPercentPressed}
                  style={dollarOrPercentB4 == 'dollar' ? styles.dollarText : styles.dollarTextDim}
                >
                  $
                </Text>
              </View>
              <View style={styles.dollarAndPercentView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMiscBeforeFees(text)}
                  defaultValue={miscBeforeFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.percentView}>
                <Text
                  onPress={miscBeforeDollarOrPercentPressed}
                  style={dollarOrPercentB4 == 'percent' ? styles.percentText : styles.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.nameTitle}>My Portion of the Broker Split</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.dollarView}>
                <Text style={styles.dollarTextDim}>$</Text>
              </View>
              <View style={styles.dollarAndPercentView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMyPortion(text)}
                  defaultValue={myPortion}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.percentView}>
                <Text style={styles.percentText}>%</Text>
              </View>
            </View>
          </View>

          <Text style={styles.nameTitle}>Misc After-Split Fees</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.dollarView}>
                <Text
                  onPress={miscAfterDollarOrPercentPressed}
                  style={dollarOrPercentAfter == 'dollar' ? styles.dollarText : styles.dollarTextDim}
                >
                  $
                </Text>
              </View>
              <View style={styles.dollarAndPercentView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMiscAfterFees(text)}
                  defaultValue={miscAfterFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.percentView}>
                <Text
                  onPress={miscAfterDollarOrPercentPressed}
                  style={dollarOrPercentAfter == 'percent' ? styles.percentText : styles.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.nameTitle}>Notes</Text>
          <View style={styles.mainContent}>
            <View style={lightOrDark == 'dark' ? styles.notesViewDark : styles.notesViewLight}>
              <TextInput
                style={lightOrDark == 'dark' ? styles.noteTextDark : styles.noteTextLight}
                placeholder="Type Here"
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                value={notes}
                onChangeText={(text) => setNotes(text)}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottom}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>Income After Broker's Split and Fees</Text>
        <Text style={styles.summaryText}>{calculateIncome()}</Text>
      </View>
    </View>
  );
}
