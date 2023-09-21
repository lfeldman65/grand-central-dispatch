import { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { roundToInt } from './transactionHelpers';
import { txStyles2 } from './styles';
import { addOrEditTransaction } from './api';
import globalStyles from '../../globalStyles';
import { shouldRunTests } from '../../utils/general';

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
  const [miscBeforeFees, setMiscBeforeFees] = useState('');
  const [myPortion, setMyPortion] = useState('50');
  const [miscAfterFees, setMiscAfterFees] = useState('');
  const [notes, setNotes] = useState('');
  const navigation = useNavigation<any>();
  const notesInputRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Lender Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={txStyles2.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={completePressed}>
          <Text style={txStyles2.backAndNext}>Complete</Text>
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

  useEffect(() => {
    if (shouldRunTests()) {
      setMiscBeforeFees('11');
      setMyPortion('55');
      setMiscAfterFees('255');
    }
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
    if (shouldRunTests()) {
      if (calculateIncome() == '$38954') {
        Alert.alert('Test Passed');
      } else {
        Alert.alert('Test Failed');
      }
    }
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
    <View style={txStyles2.container}>
      <ScrollView>
        <View style={txStyles2.topContainer}>
          <Text style={txStyles2.nameTitle}>Misc Before-Split Fees</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={miscBeforeDollarOrPercentPressed}
                  style={dollarOrPercentB4 == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
                >
                  $
                </Text>
              </View>
              <View style={txStyles2.dollarAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMiscBeforeFees(text)}
                  defaultValue={miscBeforeFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={miscBeforeDollarOrPercentPressed}
                  style={dollarOrPercentB4 == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>My Portion of the Broker Split</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.numberAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMyPortion(text)}
                  defaultValue={myPortion}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.justPercentView}>
                <Text style={txStyles2.percentText}>%</Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>Misc After-Split Fees</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={miscAfterDollarOrPercentPressed}
                  style={dollarOrPercentAfter == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
                >
                  $
                </Text>
              </View>
              <View style={txStyles2.dollarAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setMiscAfterFees(text)}
                  defaultValue={miscAfterFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={miscAfterDollarOrPercentPressed}
                  style={dollarOrPercentAfter == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>Notes</Text>
          <View style={txStyles2.mainContent}>
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
        <View style={txStyles2.footer}></View>
      </ScrollView>

      <View style={txStyles2.bottomContainer}>
        <Text style={txStyles2.summaryText}>Income After Broker's Split and Fees</Text>
        <Text style={txStyles2.summaryText}>{calculateIncome()}</Text>
      </View>
    </View>
  );
}
