import { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, Alert, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import React from 'react';
import { probabilityMenuNew, lenderTypeMenu, roundToInt, loanTypeMenuNew, loanTypeMenu } from './transactionHelpers';
import ChooseLoanDescription from './ChooseLoanDescription';
import { shouldRunTests } from '../../utils/general';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { txStyles2 } from './styles';
import { useActionSheet } from '@expo/react-native-action-sheet';

var grossComm1 = 0;

export default function AddOrEditLenderTx2(props: any) {
  const { route } = props;
  const { status, type, leadSource, borrower, seller, address, street1, street2, city, state, zip, data, source } =
    route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [originalPrice, setOriginalPrice] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date());
  const [closingDate, setClosingDate] = useState(new Date());
  const [closingPrice, setClosingPrice] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [rateType, setRateType] = useState('Fixed'); // Loan Type in app
  const [rateTypeDesc, setRateTypeDesc] = useState('1st'); //
  const [originationFees, setOriginationFees] = useState('0'); // sellerCommission in Postman
  const [buyerCommission, setBuyerCommission] = useState('0');
  const [additionalIncome, setAdditionalIncome] = useState('0');
  const [showApplicationDate, setShowApplicationDate] = useState(false);
  const [showClosingDate, setShowClosingDate] = useState(false);
  const [dOrPOriginationFees, setDOrPOriginationFees] = useState('dollar'); // change to percent
  const [dOrPBuyerCommission, setDOrPBuyerCommission] = useState('percent');
  const [dOrPAdditionalIncome, setDOrPAdditionalIncome] = useState('dollar');
  const [modalLoanDescVisible, setModalLoanDescVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Lender Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={txStyles2.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={nextPressed}>
          <Text style={isDataValid() ? txStyles2.backAndNext : txStyles2.backAndNextDim}>Next</Text>
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

  useEffect(() => {
    if (shouldRunTests()) {
      setOriginalPrice('500000');
      setClosingPrice('400000');
      setInterestRate('2');
      setOriginationFees('90');
      setBuyerCommission('20'); // % by default
      setAdditionalIncome('10'); // $ by default
    }
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

  const handleConfirmClosingDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setClosingDate(currentDate);
    setShowClosingDate(false);
  };

  const handleConfirmApplicationDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setApplicationDate(currentDate);
    setShowApplicationDate(false);
  };

  const showClosingDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowClosingDate(true);
  };

  const showApplicationDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowApplicationDate(true);
  };

  function hideClosingDatePicker() {
    setShowClosingDate(false);
  }

  function hideApplicationDatePicker() {
    setShowApplicationDate(false);
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (closingPrice == '' || closingPrice == null) {
      console.log('closing price:' + closingPrice);
      return false;
    }
    if (closingDate == null) {
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
      //   console.log('ADD INCOME: ' + additionalIncome);
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
    if (closingPrice == '' || closingPrice == null) {
      Alert.alert('Please enter a Closing Price');
      return;
    }
    if (closingDate == null) {
      Alert.alert('Please enter a Closing Date');
      return;
    }

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
        source: source,
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

  const loanTypePressed = () => {
    const options = loanTypeMenuNew;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          console.log('selected:' + options[selectedIndex!]);
          setRateType(options[selectedIndex!]);
        }
      }
    );
  };

  const probabilityPressed = () => {
    const options = probabilityMenuNew;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          console.log('selected:' + options[selectedIndex!]);
          setProbability(options[selectedIndex!]);
        }
      }
    );
  };

  return (
    <View style={txStyles2.container}>
      <ScrollView>
        <View style={txStyles2.topContainer}>
          <Text style={txStyles2.nameTitle}>Probability to Close</Text>
          <TouchableOpacity onPress={probabilityPressed}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>{probability}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={txStyles2.nameTitle}>{'Original List Price'}</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.dollarView}>
                <Text style={txStyles2.dollarText}>$</Text>
              </View>
              <View style={txStyles2.dollarAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setOriginalPrice(text)}
                  defaultValue={originalPrice}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}></View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>{'Loan Application Date'}</Text>
          <TouchableOpacity onPress={showApplicationDateMode}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>
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

          <DateTimePickerModal
            isVisible={showApplicationDate}
            mode="date"
            onConfirm={handleConfirmApplicationDate}
            onCancel={hideApplicationDatePicker}
          />

          <Text style={txStyles2.nameTitle}>{'Projected Closing Price *'}</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.dollarView}>
                <Text style={txStyles2.dollarText}>$</Text>
              </View>
              <View style={txStyles2.dollarAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setClosingPrice(text)}
                  defaultValue={closingPrice}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}></View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>{'Projected Closing Date *'}</Text>
          <TouchableOpacity onPress={showClosingDateMode}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>
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

          <DateTimePickerModal
            isVisible={showClosingDate}
            mode="date"
            onConfirm={handleConfirmClosingDate}
            onCancel={hideClosingDatePicker}
          />

          <Text style={txStyles2.nameTitle}>Interest Rate</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.numberAndPercentView}>
                <TextInput
                  style={txStyles2.textInput}
                  placeholder="+ Add"
                  placeholderTextColor="#AFB9C2"
                  textAlign="left"
                  onChangeText={(text) => setInterestRate(text)}
                  defaultValue={interestRate}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={txStyles2.justPercentView}>
                <Text style={txStyles2.percentText}>%</Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>Loan Type</Text>
          <TouchableOpacity onPress={loanTypePressed}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>{rateType}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* In postman, the param is loanType */}
          <Text style={txStyles2.nameTitle}>Loan Description</Text>
          <TouchableOpacity onPress={loanDescriptionPressed}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>{rateTypeDesc}</Text>
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

          <Text style={txStyles2.nameTitle}>Origination Fees</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={originationFeesDollarOrPercentPressed}
                  style={dOrPOriginationFees == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                  onChangeText={(text) => setOriginationFees(text)}
                  defaultValue={originationFees}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={originationFeesDollarOrPercentPressed}
                  style={dOrPOriginationFees == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>{"Buyer's Commission"}</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={buyerCommDollarOrPercentPressed}
                  style={dOrPBuyerCommission == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                  onChangeText={(text) => setBuyerCommission(text)}
                  defaultValue={buyerCommission}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={buyerCommDollarOrPercentPressed}
                  style={dOrPBuyerCommission == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>

          <Text style={txStyles2.nameTitle}>Additional Income</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={addIncomeDollarOrPercentPressed}
                  style={dOrPAdditionalIncome == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                  onChangeText={(text) => setAdditionalIncome(text)}
                  defaultValue={additionalIncome}
                  keyboardType="number-pad"
                />
              </View>
              <View style={txStyles2.percentView}>
                <Text
                  onPress={addIncomeDollarOrPercentPressed}
                  style={dOrPAdditionalIncome == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                >
                  %
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={txStyles2.bottom}></View>
      </ScrollView>

      <View style={txStyles2.bottomContainer}>
        <Text style={txStyles2.summaryText}>My Gross Commission</Text>
        <Text style={txStyles2.summaryText}>{calculateGrossCommission()}</Text>
      </View>
    </View>
  );
}
