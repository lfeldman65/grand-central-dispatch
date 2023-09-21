import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { AddTxBuyerAndSellerSheets, probabilityMenu, roundToInt } from './transactionHelpers';
import { shouldRunTests } from '../../utils/general';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { txStyles2 } from './styles';

var grossComm = 0;

export default function AddOrEditRealtorTx2(props: any) {
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
    data,
    source,
  } = route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [closingPrice, setClosingPrice] = useState('');
  const [closingDate, setClosingDate] = useState(new Date());
  const [originalDate, setOriginalDate] = useState(new Date());
  const [originalPrice, setOriginalPrice] = useState('');
  const [buyerCommission, setBuyerCommission] = useState('');
  const [sellerCommission, setSellerCommission] = useState('');
  const [additionalIncome, setAdditionalIncome] = useState('');
  const [showOriginalDate, setShowOriginalDate] = useState(false);
  const [showClosingDate, setShowClosingDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [dollarOrPercentBuyerComm, setDollarOrPercentBuyerComm] = useState('percent');
  const [dollarOrPercentSellerComm, setDollarOrPercentSellerComm] = useState('percent');
  const [dollarOrPercentAddIncome, setDollarOrPercentAddIncome] = useState('percent');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Real Estate Transaction',
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
    grossComm,
  ]);

  useEffect(() => {
    calculateGrossCommission();
  }, [isFocused]);

  useEffect(() => {
    calculateGrossCommission();
    isDataValid;
  }, [
    closingPrice,
    buyerCommission,
    sellerCommission,
    additionalIncome,
    dollarOrPercentBuyerComm,
    dollarOrPercentSellerComm,
    dollarOrPercentAddIncome,
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
      setBuyerCommission('20'); // % by default
      setAdditionalIncome('10'); // % by default
      setClosingPrice('400000');
      setOriginalPrice('500000');
    }
  }, [isFocused]);

  const handleConfirmClosingDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setClosingDate(currentDate);
    setShowClosingDate(false);
  };

  const handleConfirmOriginalDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setOriginalDate(currentDate);
    setShowOriginalDate(false);
  };

  function hideClosingDatePicker() {
    setShowClosingDate(false);
  }

  function hideOriginalDatePicker() {
    setShowOriginalDate(false);
  }

  function populateDataIfEdit(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    if (data != null && data.id != '') {
      setProbability(data?.probabilityToClose);
      if (data?.transactionType.includes('Seller') && data?.listAmount != '') {
        setOriginalPrice(data?.listAmount);
      }
      if (data?.transactionType.includes('Seller') && data?.listDate != null) {
        console.log('LISTDATE: ' + data?.listDate);
        setOriginalDate(new Date(data?.listDate));
        //console.log('list date ' + data?.listDate);
      }
      if (data?.closingPrice != '') {
        setClosingPrice(data?.projectedAmount);
      }
      if (data?.closingDate != null) {
        console.log('CLOSINGDATE: ' + data?.closingDate);
        setClosingDate(new Date(data?.closingDate));
      }
      populateCommissionAndAdditionalIncome(data?.transactionType!);
    } else {
      console.log('ADDTXMODE');
    }
  }

  function populateCommissionAndAdditionalIncome(typeTX: string) {
    console.log('TXTYPE: ' + typeTX);
    if (typeTX.includes('Seller')) {
      setSellerCommission(data?.sellerCommission);
      setDollarOrPercentSellerComm(data?.sellerCommissionType);
    }
    if (typeTX.includes('Buyer')) {
      setBuyerCommission(data?.buyerCommission);
      setDollarOrPercentBuyerComm(data?.buyerCommissionType);
    }
    setAdditionalIncome(data?.additionalIncome);
    setDollarOrPercentAddIncome(data?.additionalIncomeType);
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (closingPrice == '' || closingPrice == null) {
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
      //  console.log('localBuyerComm:' + buyerCommFloat);
      if (sellerCommission == '' || sellerCommission == null) {
        sellerCommFloat = 0;
      } else if (!type.includes('Seller')) {
        sellerCommFloat = 0;
      } else {
        sellerCommFloat = parseFloat(sellerCommission);
      }
      //   console.log('localSellerComm:' + sellerCommFloat);

      if (additionalIncome == '' || additionalIncome == null) {
        addIncomeFloat = 0;
      } else {
        addIncomeFloat = parseFloat(additionalIncome);
      }
      //   console.log('localAddIncome:' + addIncomeFloat);
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
    if (closingPrice == '' || closingPrice == null) {
      Alert.alert('Please enter a Projected Closing Price');
      return;
    }
    if (closingDate == null) {
      Alert.alert('Please enter a Projected Closing Date');
      return false;
    }
    navigation.navigate('AddOrEditRealtorTx3', {
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
      country: 'USA',
      probability: probability,
      originalPrice: originalPrice,
      originalDate: originalDate.toISOString(),
      closingPrice: closingPrice,
      closingDate: closingDate.toISOString(),
      buyerComm: buyerCommission,
      sellerComm: sellerCommission,
      dollarOrPercentBuyerComm: dollarOrPercentBuyerComm,
      dollarOrPercentSellerComm: dollarOrPercentSellerComm,
      additionalIncome: additionalIncome,
      dollarOrPercentAddIncome: dollarOrPercentAddIncome,
      grossComm: grossComm,
      data: data,
      source: source,
    });
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

  const showOriginalDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowOriginalDate(true);
  };

  const showOriginalDatePicker = () => {
    console.log('show original date picker');
    showOriginalDateMode('date');
  };

  const showClosingDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowClosingDate(true);
  };

  const showClosingDatePicker = () => {
    console.log('show closing date picker');
    showClosingDateMode('date');
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

          {type.includes('Seller') && <Text style={txStyles2.nameTitle}>{'Original List Price'}</Text>}
          {type.includes('Seller') && (
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
          )}

          {type.includes('Seller') && <Text style={txStyles2.nameTitle}>{'Original List Date'}</Text>}
          {type.includes('Seller') && (
            <TouchableOpacity onPress={showOriginalDatePicker}>
              <View style={txStyles2.mainContent}>
                <View style={txStyles2.inputView}>
                  <Text style={txStyles2.textInput}>
                    {originalDate.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      //timeZone: 'UTC'
                      //   hour: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <DateTimePickerModal
            isVisible={showOriginalDate}
            mode="date"
            onConfirm={handleConfirmOriginalDate}
            onCancel={hideOriginalDatePicker}
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
          <TouchableOpacity onPress={showClosingDatePicker}>
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.inputView}>
                <Text style={txStyles2.textInput}>
                  {closingDate.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    //timeZone: 'UTC'
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

          {type.includes('Buyer') && <Text style={txStyles2.nameTitle}>{"Buyer's Commission"}</Text>}
          {type.includes('Buyer') && (
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.dollarAndPercentRow}>
                <View style={txStyles2.percentView}>
                  <Text
                    onPress={buyerCommDollarOrPercentPressed}
                    style={dollarOrPercentBuyerComm == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                    style={dollarOrPercentBuyerComm == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                  >
                    %
                  </Text>
                </View>
              </View>
            </View>
          )}

          {type.includes('Seller') && <Text style={txStyles2.nameTitle}>{"Seller's Commission"}</Text>}
          {type.includes('Seller') && (
            <View style={txStyles2.mainContent}>
              <View style={txStyles2.dollarAndPercentRow}>
                <View style={txStyles2.dollarView}>
                  <Text
                    onPress={sellerCommDollarOrPercentPressed}
                    style={dollarOrPercentSellerComm == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                    onChangeText={(text) => setSellerCommission(text)}
                    defaultValue={sellerCommission}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={txStyles2.percentView}>
                  <Text
                    onPress={sellerCommDollarOrPercentPressed}
                    style={dollarOrPercentSellerComm == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
                  >
                    %
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Text style={txStyles2.nameTitle}>Additional Income</Text>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.dollarAndPercentRow}>
              <View style={txStyles2.dollarView}>
                <Text
                  onPress={addIncomeDollarOrPercentPressed}
                  style={dollarOrPercentAddIncome == 'dollar' ? txStyles2.dollarText : txStyles2.dollarTextDim}
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
                  style={dollarOrPercentAddIncome == 'percent' ? txStyles2.percentText : txStyles2.percentTextDim}
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
