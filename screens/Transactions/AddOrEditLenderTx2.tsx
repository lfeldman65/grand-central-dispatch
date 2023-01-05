import { Fragment, useLayoutEffect, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddTxBuyerAndSellerSheets, probabilityMenu, loanTypeMenu, styles, roundToInt } from './transactionHelpers';
import ChooseLoanDescription from './ChooseLoanDescription';

var grossComm1 = 0;

export default function AddOrEditLenderTx2(props: any) {
  const { route } = props;
  const { status, type, leadSource, borrower, seller, address, street1, street2, city, state, zip, data } =
    route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [originalPrice, setOriginalPrice] = useState('200000'); // 500000
  const [applicationDate, setApplicationDate] = useState(new Date());
  const [closingDate, setClosingDate] = useState(new Date());
  const [closingPrice, setClosingPrice] = useState('400000');
  const [interestRate, setInterestRate] = useState('2');
  const [rateType, setRateType] = useState('Fixed'); // Loan Type in app
  const [rateTypeDesc, setRateTypeDesc] = useState('1st'); //
  const [originationFees, setOriginationFees] = useState('90'); // sellerCommission in Postman
  const [buyerCommission, setBuyerCommission] = useState('10');
  const [additionalIncome, setAdditionalIncome] = useState('200');
  const [showApplicationDate, setShowApplicationDate] = useState(false);
  const [showClosingDate, setShowClosingDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [dOrPOriginationFees, setDOrPOriginationFees] = useState('dollar'); // change to percent
  const [dOrPBuyerCommission, setDOrPBuyerCommission] = useState('percent');
  const [dOrPAdditionalIncome, setDOrPAdditionalIncome] = useState('dollar');
  const [modalLoanDescVisible, setModalLoanDescVisible] = useState(false);

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
        <TouchableOpacity onPress={nextPressed}>
          <Text style={isDataValid() ? styles.backAndNext : styles.backAndNextDim}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    probability,
    applicationDate,
    originalPrice,
    closingPrice,
    closingDate,
    interestRate,
    rateType,
    rateTypeDesc,
    originationFees,
    dOrPOriginationFees,
    buyerCommission,
    dOrPBuyerCommission,
    additionalIncome,
    dOrPAdditionalIncome,
    leadSource,
    borrower,
    seller,
  ]);

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
      setProbability(data?.probabilityToClose);
      setOriginalPrice(data?.listAmount);
      setApplicationDate(new Date(data?.listDate));
      setClosingPrice(data?.projectedAmount);
      setClosingDate(new Date(data?.closingDate));
      setInterestRate(data?.interestRate);
      setRateType(data?.rateType);
      setRateTypeDesc(data?.loanType);
      setOriginationFees(data?.sellerCommission);
      setBuyerCommission(data?.buyerCommission);
      setAdditionalIncome(data?.additionalIncome);
    } else {
      console.log('ADDTXMODE');
    }
  }

  useEffect(() => {
    calculateGrossCommission;
    isDataValid;
  }, [
    closingPrice,
    buyerCommission,
    additionalIncome,
    originationFees,
    dOrPOriginationFees,
    dOrPBuyerCommission,
    dOrPAdditionalIncome,
  ]);

  useEffect(() => {
    calculateGrossCommission();
  }, [isFocused]);

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (closingPrice == '' || closingPrice == null) {
      console.log('closing price:' + closingPrice);
      return false;
    }
    return true;
  }

  function calculateGrossCommission() {
    try {
      var buyerCommFloat = 0;
      var addIncomeFloat = 0;
      var origFeesFloat = 0;
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
      //  console.log('BUYER COMM: ' + buyerCommFloat);
      if (originationFees == '' || originationFees == null) {
        origFeesFloat = 0;
      } else {
        origFeesFloat = parseFloat(originationFees);
      }
      //   console.log('ORIG FEES: ' + origFeesFloat);
      if (additionalIncome == '' || additionalIncome == null) {
        addIncomeFloat = 0;
      } else {
        addIncomeFloat = parseFloat(additionalIncome);
      }
      //S   console.log('ADD INCOME: ' + additionalIncome);
      if (dOrPBuyerCommission == 'percent') {
        buyerCommFloat = (closingPriceFloat * buyerCommFloat) / 100;
        console.log('BUYER COMM 2: ' + buyerCommFloat);
      }
      if (dOrPOriginationFees == 'percent') {
        origFeesFloat = (closingPriceFloat * origFeesFloat) / 100;
      }
      if (dOrPAdditionalIncome == 'percent') {
        addIncomeFloat = (closingPriceFloat * addIncomeFloat) / 100;
      }
      grossComm1 = buyerCommFloat + origFeesFloat + addIncomeFloat;
      return '$' + roundToInt(grossComm1.toString());
    } catch {
      console.log('error');
    }
  }

  function nextPressed() {
    console.log('add income next: ' + additionalIncome);
    console.log('add income next: ' + dOrPAdditionalIncome);

    if (isDataValid()) {
      navigation.navigate('AddOrEditLenderTx3', {
        status: status,
        type: type,
        leadSource: leadSource,
        borrower: borrower,
        address: address,
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        probability: probability,
        originalPrice: originalPrice,
        applicationDate: applicationDate.toISOString(),
        closingPrice: closingPrice,
        closingDate: closingDate.toISOString(),
        interestRate: interestRate,
        buyerCommission: buyerCommission,
        dOrPBuyerCommission: dOrPBuyerCommission,
        originationFees: originationFees,
        dOrPOriginationFees: dOrPOriginationFees,
        additionalIncome: additionalIncome,
        dOrPAdditionalIncome: dOrPAdditionalIncome,
        rateType: rateType, // Loan Type in App
        rateTypeDesc: rateTypeDesc, // Loan Desc in App
        myGrossComm: grossComm1,
        data: data,
      });
    }
  }

  function originationFeesDollarOrPercentPressed() {
    if (dOrPOriginationFees == 'percent') {
      setDOrPOriginationFees('dollar');
    } else {
      setDOrPOriginationFees('percent');
    }
  }

  function buyerCommDollarOrPercentPressed() {
    if (dOrPBuyerCommission == 'percent') {
      setDOrPBuyerCommission('dollar');
    } else {
      setDOrPBuyerCommission('percent');
    }
  }

  function addIncomeDollarOrPercentPressed() {
    if (dOrPAdditionalIncome == 'percent') {
      setDOrPAdditionalIncome('dollar');
    } else {
      setDOrPAdditionalIncome('percent');
    }
  }

  function loanDescriptionPressed() {
    setModalLoanDescVisible(!modalLoanDescVisible);
  }

  function loanTypePressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.loanTypeSourceSheet);
  }

  function probabilityPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.probabilitySheet);
  }

  const onApplicationDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setApplicationDate(currentDate);
  };

  const showApplicationDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowApplicationDate(true);
  };

  const showApplicationDatePicker = () => {
    console.log('show date picker application date');
    showApplicationDateMode('date');
  };

  const onClosingDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setClosingDate(currentDate);
  };

  const showClosingDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowClosingDate(true);
  };

  const showClosingDatePicker = () => {
    console.log('show date picker closing');
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

          <ActionSheet // Probability
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

          <Text style={styles.nameTitle}>{'Original List Price'}</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.dollarView}>
                <Text style={styles.dollarText}>$</Text>
              </View>
              <View style={styles.dollarAndPercentView}>
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
              <View style={styles.percentView}></View>
            </View>
          </View>

          <Text style={styles.nameTitle}>{'Loan Application Date'}</Text>
          <TouchableOpacity onPress={showApplicationDatePicker}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {applicationDate.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    //   hour: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {showApplicationDate && (
            <TouchableOpacity
              onPress={() => {
                setShowApplicationDate(false);
              }}
            >
              <Text style={styles.closePicker}>Close</Text>
            </TouchableOpacity>
          )}
          {showApplicationDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={applicationDate}
              mode={'date'}
              is24Hour={true}
              onChange={onApplicationDatePickerChange}
              display="spinner"
              textColor="white"
            />
          )}

          <Text style={styles.nameTitle}>{'Closing Price (Projected)'}</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.dollarView}>
                <Text style={styles.dollarText}>$</Text>
              </View>
              <View style={styles.dollarAndPercentView}>
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
              <View style={styles.percentView}></View>
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

          <Text style={styles.nameTitle}>Interest Rate</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.numberAndPercentView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setInterestRate(text)}
                  defaultValue={interestRate}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.justPercentView}>
                <Text style={styles.percentText}>%</Text>
              </View>
            </View>
          </View>

          <Text style={styles.nameTitle}>Loan Type</Text>
          <TouchableOpacity onPress={loanTypePressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{rateType}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <ActionSheet // Loan type
            initialOffsetFromBottom={10}
            onBeforeShow={(data) => console.log('loan type sheet')} // here
            id={AddTxBuyerAndSellerSheets.loanTypeSourceSheet} // here
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
                  {Object.entries(loanTypeMenu).map(([index, value]) => (
                    <TouchableOpacity // line above
                      key={index}
                      onPress={() => {
                        SheetManager.hide(AddTxBuyerAndSellerSheets.loanTypeSourceSheet, null); // here
                        console.log('filter: ' + value);
                        setRateType(value); // here
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

          {/* In postman, the param is loanType */}
          <Text style={styles.nameTitle}>Loan Description</Text>
          <TouchableOpacity onPress={loanDescriptionPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{rateTypeDesc}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {modalLoanDescVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalLoanDescVisible}
              onRequestClose={() => {
                setModalLoanDescVisible(!modalLoanDescVisible);
              }}
            >
              <ChooseLoanDescription
                title="Loan Description"
                setModalSourceVisible={setModalLoanDescVisible}
                setSelectedSource={setRateTypeDesc}
              />
            </Modal>
          )}

          <Text style={styles.nameTitle}>Origination Fees</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.percentView}>
                <Text
                  onPress={originationFeesDollarOrPercentPressed}
                  style={dOrPOriginationFees == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                  onChangeText={(text) => setOriginationFees(text)}
                  defaultValue={originationFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.percentView}>
                <Text
                  onPress={originationFeesDollarOrPercentPressed}
                  style={dOrPOriginationFees == 'percent' ? styles.percentText : styles.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.nameTitle}>{"Buyer's Commission"}</Text>
          <View style={styles.mainContent}>
            <View style={styles.dollarAndPercentRow}>
              <View style={styles.percentView}>
                <Text
                  onPress={buyerCommDollarOrPercentPressed}
                  style={dOrPBuyerCommission == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                  style={dOrPBuyerCommission == 'percent' ? styles.percentText : styles.percentTextDim}
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
                  style={dOrPAdditionalIncome == 'dollar' ? styles.dollarText : styles.dollarTextDim}
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
                  style={dOrPAdditionalIncome == 'percent' ? styles.percentText : styles.percentTextDim}
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
