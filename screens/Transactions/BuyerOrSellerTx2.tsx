import { Fragment, useLayoutEffect, useState } from 'react';
import { Alert, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddTxBuyerAndSellerSheets, probabilityMenu, styles, roundToInt } from './transactionHelpers';

var grossComm = 0;

export default function BuyerOrSellerTx2(props: any) {
  const { route } = props;
  const { status, type, buyerLeadSource, sellerLeadSource, buyer, seller, street1, street2, city, state, zip } =
    route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [closingPrice, setClosingPrice] = useState(''); // 400000
  const [closingDate, setClosingDate] = useState(new Date());
  const [originalDate, setOriginalDate] = useState(new Date());
  const [originalPrice, setOriginalPrice] = useState(''); // 400000
  const [buyerCommission, setBuyerCommission] = useState('0'); // 20
  const [sellerCommission, setSellerCommission] = useState('0');
  const [additionalIncome, setAdditionalIncome] = useState('0');
  const [showOriginalDate, setShowOriginalDate] = useState(false);
  const [showClosingDate, setShowClosingDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [dollarOrPercentBuyerComm, setDollarOrPercentBuyerComm] = useState('percent');
  const [dollarOrPercentSellerComm, setDollarOrPercentSellerComm] = useState('percent');
  const [dollarOrPercentAddIncome, setDollarOrPercentAddIncome] = useState('dollar');
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
          <Text style={isDataValid() ? styles.backAndNext : styles.backAndNextDim}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    buyer,
    seller,
    originalDate,
    closingDate,
    originalPrice,
    closingPrice,
    probability,
    buyerCommission,
    sellerCommission,
    additionalIncome,
    dollarOrPercentBuyerComm,
    dollarOrPercentSellerComm,
    dollarOrPercentAddIncome,
  ]);

  useEffect(() => {
    calculateGrossCommission;
  }, [
    buyerCommission,
    sellerCommission,
    additionalIncome,
    dollarOrPercentBuyerComm,
    dollarOrPercentSellerComm,
    dollarOrPercentAddIncome,
  ]);

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (type.includes('Seller') && originalPrice == null) {
      return false;
    }
    if (type.includes('Seller') && originalDate == null) {
      return false;
    }
    if (closingPrice == '' || closingPrice == null) {
      return false;
    }
    return true;
  }

  function calculateGrossCommission() {
    try {
      var buyerCommFloat = 0;
      var sellerCommFloat = 0;
      var addIncomeFloat = 0;
      var closingPriceFloat = 0;

      if (closingPrice == '' || closingPrice == null) {
        closingPriceFloat = 0;
      } else {
        closingPriceFloat = parseFloat(closingPrice);
      }
      if (buyerCommission == '' || buyerCommission == null) {
        buyerCommFloat = 0;
      } else if (!type.includes('Buyer')) {
        buyerCommFloat = 0;
      } else {
        buyerCommFloat = parseFloat(buyerCommission);
      }
      console.log('localBuyerComm:' + buyerCommFloat);
      if (sellerCommission == '' || sellerCommission == null) {
        sellerCommFloat = 0;
      } else if (!type.includes('Seller')) {
        sellerCommFloat = 0;
      } else {
        sellerCommFloat = parseFloat(sellerCommission);
      }
      console.log('localSellerComm:' + sellerCommFloat);

      if (additionalIncome == '' || additionalIncome == null) {
        addIncomeFloat = 0;
      } else {
        addIncomeFloat = parseFloat(additionalIncome);
      }
      console.log('localAddIncome:' + addIncomeFloat);
      if (dollarOrPercentBuyerComm == 'percent') {
        buyerCommFloat = (closingPriceFloat * buyerCommFloat) / 100;
      }
      if (dollarOrPercentSellerComm == 'percent') {
        sellerCommFloat = (closingPriceFloat * sellerCommFloat) / 100;
      }
      if (dollarOrPercentAddIncome == 'percent') {
        addIncomeFloat = (closingPriceFloat * addIncomeFloat) / 100;
      }
      grossComm = buyerCommFloat + sellerCommFloat + addIncomeFloat;
      return '$' + roundToInt(grossComm.toString()); // Should be $120000 with test values
    } catch {
      console.log('error');
    }
  }

  function nextPressed() {
    if (isDataValid()) {
      console.log('next seller comm: ' + sellerCommission);
      console.log('next seller comm: ' + dollarOrPercentSellerComm);
      navigation.navigate('BuyerOrSellerTx3', {
        status: status,
        type: type,
        buyerLeadSource: buyerLeadSource,
        sellerLeadSource: sellerLeadSource,
        buyer: buyer,
        seller: seller,
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        probability: probability,
        originalPrice: originalPrice,
        originalDate: originalDate.toISOString(),
        closingPrice: closingPrice,
        closingDate: closingDate.toISOString(),
        buyerComm: buyerCommission,
        sellerComm: sellerCommission,
        dOrPBuyerComm: dollarOrPercentBuyerComm,
        addIncome: additionalIncome,
        dOrPAddIncome: dollarOrPercentAddIncome,
        myGrossComm: grossComm,
      });
    }
  }

  function buyerCommDollarOrPercentPressed() {
    if (dollarOrPercentBuyerComm == 'percent') {
      setDollarOrPercentBuyerComm('dollar');
    } else {
      setDollarOrPercentBuyerComm('percent');
    }
  }

  function sellerCommDollarOrPercentPressed() {
    if (dollarOrPercentSellerComm == 'percent') {
      setDollarOrPercentSellerComm('dollar');
    } else {
      setDollarOrPercentSellerComm('percent');
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

  const onOriginalDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log('picker:' + currentDate);
    setOriginalDate(currentDate);
  };

  const showOriginalDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowOriginalDate(true);
  };

  const showOriginalDatePicker = () => {
    console.log('show date picker top');
    showOriginalDateMode('date');
  };

  const onClosingDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log('picker:' + currentDate);
    setClosingDate(currentDate);
  };

  const showClosingDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowClosingDate(true);
  };

  const showClosingDatePicker = () => {
    console.log('show date picker top');
    showClosingDateMode('date');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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

          {type.includes('Seller') && <Text style={styles.nameTitle}>{'Original List Price'}</Text>}
          {type.includes('Seller') && (
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setOriginalPrice(text)}
                  defaultValue={originalPrice}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          )}

          {type.includes('Seller') && <Text style={styles.nameTitle}>{'Original List Date'}</Text>}
          {type.includes('Seller') && (
            <TouchableOpacity onPress={showOriginalDatePicker}>
              <View style={styles.mainContent}>
                <View style={styles.inputView}>
                  <Text style={styles.textInput}>
                    {originalDate.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      //   hour: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {showOriginalDate && (
            <TouchableOpacity
              onPress={() => {
                setShowOriginalDate(false);
              }}
            >
              <Text style={styles.closePicker}>Close</Text>
            </TouchableOpacity>
          )}
          {showOriginalDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={originalDate}
              mode={'date'}
              is24Hour={true}
              onChange={onOriginalDatePickerChange}
              display="spinner"
              textColor="white"
            />
          )}

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
          <TouchableOpacity onPress={showClosingDatePicker}>
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

          {showClosingDate && (
            <TouchableOpacity
              onPress={() => {
                setShowClosingDate(false);
              }}
            >
              <Text style={styles.closePicker}>Close</Text>
            </TouchableOpacity>
          )}
          {showClosingDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={closingDate}
              mode={'date'}
              is24Hour={true}
              onChange={onClosingDatePickerChange}
              display="spinner"
              textColor="white"
            />
          )}

          {type.includes('Buyer') && <Text style={styles.nameTitle}>{"Buyer's Commission"}</Text>}
          {type.includes('Buyer') && (
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
          )}

          {type.includes('Seller') && <Text style={styles.nameTitle}>{"Seller's Commission"}</Text>}
          {type.includes('Seller') && (
            <View style={styles.mainContent}>
              <View style={styles.dollarAndPercentRow}>
                <View style={styles.percentView}>
                  <Text
                    onPress={sellerCommDollarOrPercentPressed}
                    style={dollarOrPercentSellerComm == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                    onChangeText={(text) => setSellerCommission(text)}
                    defaultValue={sellerCommission}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.percentView}>
                  <Text
                    onPress={sellerCommDollarOrPercentPressed}
                    style={dollarOrPercentSellerComm == 'percent' ? styles.percentText : styles.percentTextDim}
                  >
                    %
                  </Text>
                </View>
              </View>
            </View>
          )}

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
        <View style={styles.bottom}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>My Gross Commission</Text>
        <Text style={styles.summaryText}>{calculateGrossCommission()}</Text>
      </View>
    </View>
  );
}
