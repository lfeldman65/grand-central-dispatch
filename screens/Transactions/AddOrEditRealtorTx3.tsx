import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import React from 'react';
import { styles, roundToInt } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditTransaction } from './api';
import { shouldRunTests } from '../../utils/general';
import globalStyles from '../../globalStyles';

var incomeAfterCosts = 0;

export default function AddOrEditRealtorTx3(props: any) {
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
    originalPrice,
    originalDate,
    closingPrice,
    closingDate,
    buyerComm,
    sellerComm,
    dollarOrPercentBuyerComm,
    dollarOrPercentSellerComm,
    dollarOrPercentAddIncome,
    additionalIncome,
    grossComm,
    data,
    source,
  } = route.params;
  const isFocused = useIsFocused();
  const [dollarOrPercentB4, setDollarOrPercentB4] = useState('dollar');
  const [miscBeforeFees, setMiscBeforeFees] = useState('');
  const [myPortion, setMyPortion] = useState('50');
  const [miscAfterFees, setMiscAfterFees] = useState('0');
  const [dollarOrPercentAfter, setDollarOrPercentAfter] = useState('dollar');
  const [notes, setNotes] = useState('');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const navigation = useNavigation<any>();
  const notesInputRef = useRef<TextInput>(null);

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
  }, [
    navigation,
    dollarOrPercentB4,
    miscBeforeFees,
    myPortion,
    miscAfterFees,
    dollarOrPercentAfter,
    notes,
    seller,
    buyer,
  ]);

  useEffect(() => {
    calculateIncome();
    if (shouldRunTests()) {
      // setMiscBeforeFees('2000');
      // setMiscAfterFees('1500');
      // setMyPortion('50');
    }
    console.log('SCREEN3: ' + data?.id!);
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

  useEffect(() => {
    let isMounted = true;
    populateDataIfEdit(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  function populateDataIfEdit(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    if (data != null && data.id != '') {
      setMiscBeforeFees(data?.miscBeforeSplitFees);
      setDollarOrPercentB4(data?.miscBeforeSplitFeesType);
      setMiscAfterFees(data?.miscAfterSplitFees);
      setDollarOrPercentAfter(data?.miscAfterSplitFeesType);
      setMyPortion(data?.commissionPortion);
      setNotes(data?.notes);
    } else {
      console.log('ADDTXMODE');
    }
  }

  function backPressed() {
    navigation.goBack();
  }

  function completePressed() {
    if (shouldRunTests()) {
      if (incomeAfterCosts == 57500) {
        Alert.alert('Test Passed');
      } else {
        Alert.alert('Test Failed');
      }
    }
    var newStreet1 = '';
    if (street1 == null || street1 == '' || street1 == 'TBD') {
      newStreet1 = 'TBD';
    }
    console.log('street1: ' + street1);
    addOrEditTransaction(
      data == null ? 0 : data?.id,
      type,
      status,
      'title',
      newStreet1,
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
      'Fixed', // rate type
      miscBeforeFees, // 2000
      dollarOrPercentB4,
      miscAfterFees, // 1500
      dollarOrPercentAfter, // dollar
      myPortion, // 50
      'percent',
      grossComm,
      calculateIncome() ?? '0',
      additionalIncome,
      dollarOrPercentAddIncome,
      '0',
      '1st',
      buyerComm,
      dollarOrPercentBuyerComm,
      sellerComm,
      dollarOrPercentSellerComm,
      notes,
      buyer,
      seller
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          leaveHere();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function leaveHere() {
    console.log('LEAVE: ' + source);
    if (source == 'Relationships') {
      navigation.navigate('RelDetails', {
        contactId: buyer?.id,
        firstName: buyer?.firstName,
        lastName: buyer?.lastName,
      });
    } else {
      navigation.popToTop();
      navigation.navigate('Home');
      navigation.navigate('RETransactionsMenu', { screen: 'RealEstateTransactions' });
    }
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
      console.log('gross comm: ' + grossComm);
      var beforeSplitFees = 0;
      var myPortionOfSplit = 0;
      var afterSplitFees = 0;
      incomeAfterCosts = grossComm;
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
        incomeAfterCosts = incomeAfterCosts - (grossComm * beforeSplitFees) / 100;
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
              <View style={styles.numberAndPercentView}>
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
              <View style={styles.justPercentView}>
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
            <TouchableOpacity style={globalStyles.notesView} onPress={handleNotesFocus}>
              <TextInput
                onPressIn={handleNotesFocus}
                ref={notesInputRef}
                multiline={true}
                numberOfLines={5}
                style={globalStyles.notesInput}
                placeholder="Type Here"
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                value={notes}
                onChangeText={(text) => setNotes(text)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}></View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>Income After Broker's Split and Fees</Text>
        <Text style={styles.summaryText}>{calculateIncome()}</Text>
      </View>
    </View>
  );
}
