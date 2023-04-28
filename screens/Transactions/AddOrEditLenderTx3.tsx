import { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { styles, roundToInt } from './transactionHelpers';
import { addOrEditTransaction } from './api';
import globalStyles from '../../globalStyles';

var incomeAfterCosts = 0;

export default function AddOrEditLenderTx3(props: any) {
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
    originalPrice,
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
    data,
    source,
  } = route.params;
  const isFocused = useIsFocused();
  const [dollarOrPercentB4, setDollarOrPercentB4] = useState('percent');
  const [dollarOrPercentAfter, setDollarOrPercentAfter] = useState('dollar');
  const [miscBeforeFees, setMiscBeforeFees] = useState('11');
  const [myPortion, setMyPortion] = useState('55');
  const [miscAfterFees, setMiscAfterFees] = useState('255');
  const [notes, setNotes] = useState('');
  const navigation = useNavigation<any>();
  const notesInputRef = useRef<TextInput>(null);

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
    populateDataIfEdit(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

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

  useEffect(() => {
    calculateIncome();
  }, [isFocused]);

  function backPressed() {
    navigation.goBack();
  }

  function completePressed() {
    console.log('NOTES: ' + notes);
    addOrEditTransaction(
      data == null ? 0 : data?.id,
      type,
      status,
      'titleNA',
      street1,
      street2,
      city,
      state,
      zip,
      'USANA',
      leadSource,
      'SellerLeadSourceNA',
      probability,
      applicationDate, // listDate in API
      closingDate, //  Test value '2016-05-25T00:00:000Z'
      originalPrice, // list amount (Not used, but must be a number string)
      closingPrice, // projectedAmount
      rateType, // Loan Type in App
      miscBeforeFees,
      dollarOrPercentB4,
      miscAfterFees,
      dollarOrPercentAfter,
      myPortion,
      'percent',
      myGrossComm.toString(),
      incomeAfterCosts.toString(),
      additionalIncome,
      dOrPAdditionalIncome,
      interestRate,
      rateTypeDesc, // Loan Description in app, loanType in Postman
      buyerCommission,
      dOrPBuyerCommission,
      originationFees, // sellerCommission
      dOrPOriginationFees, // sellerCommissionType
      notes,
      borrower,
      seller
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log('here ' + res.data.id);
          leaveHere();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function leaveHere() {
    console.log('Leave: ' + source);
    if (source == 'Relationships') {
      navigation.navigate('RelDetails', {
        contactId: borrower?.id,
        firstName: borrower?.firstName,
        lastName: borrower?.lastName,
      });
    } else {
      navigation.popToTop();
      navigation.navigate('Home');
      navigation.navigate('LenderTransactionsMenu', { screen: 'LenderTransactions' });
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
      console.log('income after costs: ' + incomeAfterCosts);
      console.log('myPortion: ' + myPortionOfSplit);
      incomeAfterCosts = (incomeAfterCosts * myPortionOfSplit) / 100;
      if (dollarOrPercentAfter == 'dollar') {
        incomeAfterCosts = incomeAfterCosts - afterSplitFees;
      } else {
        incomeAfterCosts = incomeAfterCosts - (incomeAfterCosts * afterSplitFees) / 100;
      }
      return '$' + roundToInt(incomeAfterCosts.toString());
    } catch {
      console.log('error');
    }
  }

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <Text style={styles.nameTitle}>Misc Before-Split Fees</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.percentView}>
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
              <View style={styles.percentView}>
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
