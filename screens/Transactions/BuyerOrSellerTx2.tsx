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
import { AddTxBuyerAndSellerSheets, probabilityMenu, styles, roundToInt } from './transactionHelpers';

var grossComm1 = 0;

export default function BuyerOrSellerTx2(props: any) {
  const { route } = props;
  const { status, type, leadSource, buyer, street1, street2, city, state, zip } = route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [closingPrice, setClosingPrice] = useState('400000'); // remove
  const [closingDate, setClosingDate] = useState(new Date());
  const [buyerCommission, setBuyerCommission] = useState('20'); // remove
  const [additionalIncome, setAdditionalIncome] = useState('10'); // remove
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [dollarOrPercentBuyerComm, setDollarOrPercentBuyerComm] = useState('percent');
  const [dollarOrPercentAddIncome, setDollarOrPercentAddIncome] = useState('percent'); // revert
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
        <TouchableOpacity onPress={nextPressed}>
          <Text style={styles.backAndNext}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    calculateGrossCommission;
  }, [closingDate, buyerCommission, additionalIncome, dollarOrPercentBuyerComm, dollarOrPercentAddIncome]);

  function backPressed() {
    navigation.goBack();
  }

  function calculateGrossCommission() {
    try {
      var buyerCommFloat = 0;
      var addIncomeFloat = 0;
      var closingPriceFloat = 0;

      if (closingPrice == '' || closingPrice == null) {
        closingPriceFloat = 0;
      } else {
        closingPriceFloat = parseFloat(closingPrice);
      }
      if (buyerCommission == '' || buyerCommission == null) {
        buyerCommFloat = 0;
      } else {
        buyerCommFloat = parseFloat(buyerCommission);
      }
      console.log('localBuyerComm:' + buyerCommFloat);
      if (additionalIncome == '' || additionalIncome == null) {
        addIncomeFloat = 0;
      } else {
        addIncomeFloat = parseFloat(additionalIncome);
      }
      console.log('localAddIncome:' + addIncomeFloat);
      if (dollarOrPercentBuyerComm == 'dollar') {
        buyerCommFloat = buyerCommFloat;
      } else {
        buyerCommFloat = (closingPriceFloat * buyerCommFloat) / 100;
      }
      console.log('buyerCommFloat:' + buyerCommFloat);
      if (dollarOrPercentAddIncome == 'dollar') {
        addIncomeFloat = addIncomeFloat;
      } else {
        addIncomeFloat = (closingPriceFloat * addIncomeFloat) / 100;
      }
      grossComm1 = buyerCommFloat + addIncomeFloat;
      return '$' + roundToInt(grossComm1.toString());
    } catch {
      console.log('error');
    }
  }

  function nextPressed() {
    navigation.navigate('BuyerOrSellerTx3', {
      status: status,
      type: type,
      leadSource: leadSource,
      buyer: buyer,
      //   address: address,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
      probability: probability,
      closingPrice: closingPrice,
      closingDate: closingDate.toDateString(),
      buyerComm: buyerCommission,
      dOrPBuyerComm: dollarOrPercentBuyerComm,
      addIncome: additionalIncome,
      dOrPAddIncome: dollarOrPercentAddIncome,
      myGrossComm: grossComm1,
    });
  }

  function buyerCommDollarOrPercentPressed() {
    if (dollarOrPercentBuyerComm == 'percent') {
      setDollarOrPercentBuyerComm('dollar');
    } else {
      setDollarOrPercentBuyerComm('percent');
    }
  }

  function addIncomeDollarOrPercentPressed() {
    if (dollarOrPercentAddIncome == 'percent') {
      setDollarOrPercentAddIncome('dollar');
    } else {
      setDollarOrPercentAddIncome('percent');
    }
  }

  function probabilityPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.probabilitySheet);
  }

  const onDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setClosingDate(currentDate);
  };

  const showDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowDate(true);
  };

  const showDateTopPicker = () => {
    console.log('show date picker top');
    showDateMode('date');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.nameTitle}>Probability to Close</Text>
        <TouchableOpacity onPress={probabilityPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{probability}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <ActionSheet // Status
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('probability sheet')} // here
          id={AddTxBuyerAndSellerSheets.probabilitySheet} // here
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={false}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.4}
        >
          <View
            style={{
              paddingHorizontal: 12,
            }}
          >
            <ScrollView
              nestedScrollEnabled
              onMomentumScrollEnd={() => {
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              style={globalStyles.filterView}
            >
              <View>
                {Object.entries(probabilityMenu).map(([index, value]) => (
                  <TouchableOpacity // line above
                    key={index}
                    onPress={() => {
                      SheetManager.hide(AddTxBuyerAndSellerSheets.probabilitySheet, null); // here
                      console.log('filter: ' + value);
                      setProbability(value); // here
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ActionSheet>

        <Text style={styles.nameTitle}>{'Closing Price (Projected)'}</Text>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setClosingPrice(text)}
              defaultValue={closingPrice}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>{'Closing Date (Projected)'}</Text>
        <TouchableOpacity onPress={showDateTopPicker}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {closingDate.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  //   hour: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {showDate && (
          <TouchableOpacity
            onPress={() => {
              setShowDate(false);
            }}
          >
            <Text style={styles.closePicker}>Close</Text>
          </TouchableOpacity>
        )}
        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={closingDate}
            mode={'date'}
            is24Hour={true}
            onChange={onDatePickerChange}
            display="spinner"
            textColor="white"
          />
        )}

        <Text style={styles.nameTitle}>{"Buyer's Commission"}</Text>
        <View style={styles.mainContent}>
          <View style={styles.dollarAndPercentRow}>
            <View style={styles.percentView}>
              <Text
                onPress={buyerCommDollarOrPercentPressed}
                style={dollarOrPercentBuyerComm == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                onChangeText={(text) => setBuyerCommission(text)}
                defaultValue={buyerCommission}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.percentView}>
              <Text
                onPress={buyerCommDollarOrPercentPressed}
                style={dollarOrPercentBuyerComm == 'percent' ? styles.percentText : styles.percentTextDim}
              >
                %
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.nameTitle}>Additional Income</Text>
        <View style={styles.mainContent}>
          <View style={styles.dollarAndPercentRow}>
            <View style={styles.percentView}>
              <Text
                onPress={addIncomeDollarOrPercentPressed}
                style={dollarOrPercentAddIncome == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                onChangeText={(text) => setAdditionalIncome(text)}
                defaultValue={additionalIncome}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.percentView}>
              <Text
                onPress={addIncomeDollarOrPercentPressed}
                style={dollarOrPercentAddIncome == 'percent' ? styles.percentText : styles.percentTextDim}
              >
                %
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>My Gross Commission</Text>
        <Text style={styles.summaryText}>{calculateGrossCommission()}</Text>
      </View>
    </View>
  );
}
