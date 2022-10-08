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

var incomeAfterCosts = 0;

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
  const [dollarOrPercent1, setDollarOrPercent1] = useState('dollar');
  const [dollarOrPercent2, setDollarOrPercent2] = useState('dollar');
  const [dollarOrPercent3, setDollarOrPercent3] = useState('dollar');
  const [miscBeforeFees, setMiscBeforeFees] = useState('');
  const [myPortion, setMyPortion] = useState('');
  const [miscAfterFees, setMiscAfterFees] = useState('');
  const [notes, setNotes] = useState('');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [destination, setDestination] = useState('');
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
  }, [navigation, destination]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getDestination(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDestination(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var dest = await storage.getItem('whoCalledTxMenu');
    console.log('destination: ' + dest);
    if (dest == null || dest == '') {
      setDestination('RealEstateTransactions');
    } else {
      setDestination(dest);
    }
  }

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
    console.log('dest2: ' + destination);
    navigation.navigate(destination);
    //  navigation.navigate('RealEstateTransactions');
  }

  function miscBeforeDollarOrPercentPressed() {
    if (dollarOrPercent1 == 'percentage') {
      setDollarOrPercent1('dollar');
    } else {
      setDollarOrPercent1('percentage');
    }
  }

  function myPortionDollarOrPercentPressed() {
    if (dollarOrPercent2 == 'percentage') {
      setDollarOrPercent2('dollar');
    } else {
      setDollarOrPercent2('percentage');
    }
  }

  function miscAfterDollarOrPercentPressed() {
    if (dollarOrPercent3 == 'percentage') {
      setDollarOrPercent3('dollar');
    } else {
      setDollarOrPercent3('percentage');
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
      if (dollarOrPercent1 == 'dollar') {
        incomeAfterCosts = incomeAfterCosts - beforeSplitFees;
      } else {
        incomeAfterCosts = incomeAfterCosts - (myGrossComm * beforeSplitFees) / 100;
      }
      console.log('income after costs: ' + incomeAfterCosts);
      console.log('myPortion: ' + myPortionOfSplit);
      incomeAfterCosts = (incomeAfterCosts * myPortionOfSplit) / 100;
      if (dollarOrPercent3 == 'dollar') {
        incomeAfterCosts = incomeAfterCosts - afterSplitFees;
      } else {
        incomeAfterCosts = incomeAfterCosts - (incomeAfterCosts * afterSplitFees) / 100;
      }
      return '$' + incomeAfterCosts.toString();
    } catch {
      console.log('error');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.nameTitle}>Misc Before-Split Fees</Text>
        <View style={styles.mainContent}>
          <View style={styles.dollarAndPercentRow}>
            <View style={styles.percentView}>
              <Text
                onPress={miscBeforeDollarOrPercentPressed}
                style={dollarOrPercent1 == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                style={dollarOrPercent1 == 'percentage' ? styles.percentText : styles.percentTextDim}
              >
                %
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.nameTitle}>My Portion of the Broker Split</Text>
        <View style={styles.mainContent}>
          <View style={styles.dollarAndPercentRow}>
            <View style={styles.percentView}>
              <Text
                onPress={myPortionDollarOrPercentPressed}
                style={dollarOrPercent2 == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                onChangeText={(text) => setMyPortion(text)}
                defaultValue={myPortion}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.percentView}>
              <Text
                onPress={myPortionDollarOrPercentPressed}
                style={dollarOrPercent2 == 'percentage' ? styles.percentText : styles.percentTextDim}
              >
                %
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.nameTitle}>Misc After-Split Fees</Text>
        <View style={styles.mainContent}>
          <View style={styles.dollarAndPercentRow}>
            <View style={styles.percentView}>
              <Text
                onPress={miscAfterDollarOrPercentPressed}
                style={dollarOrPercent3 == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                style={dollarOrPercent3 == 'percentage' ? styles.percentText : styles.percentTextDim}
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

      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>Income After Broker's Split and Fees</Text>
        <Text style={styles.summaryText}>{calculateIncome()}</Text>
      </View>
    </View>
  );
}
