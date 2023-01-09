import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddTxBuyerAndSellerSheets, probabilityMenu, styles } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditOtherTransaction } from './api';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function AddOrEditOtherTx2(props: any) {
  const { route } = props;
  const { data, status, type, title, whoInvolved, street1, street2, city, state, zip, source } = route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [closingPrice, setClosingPrice] = useState('');
  const [closingDate, setClosingDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Other Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={completePressed}>
          <Text style={isDataValid() ? styles.backAndNext : styles.backAndNextDim}>Complete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, probability, closingDate, closingPrice, notes, data]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    console.log('TYPE:' + type);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    populateDataIfEdit(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function populateDataIfEdit(isMounted: boolean) {
    console.log('guid: ' + data?.id);
    if (!isMounted) {
      return;
    }
    if (data != null && data.id != '') {
      setProbability(data?.probabilityToClose);
      setClosingPrice(data?.projectedAmount);
      setClosingDate(new Date(data?.closingDate));
      setNotes(data?.notes);
    } else {
      console.log('ADDTXMODE');
    }
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (closingPrice == '') {
      return false;
    }
    return true;
  }

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function completePressed() {
    console.log('CLOSING DATE: ' + closingDate);
    addOrEditOtherTransaction(
      data == null ? 0 : data?.id,
      type,
      status,
      title,
      street1,
      street2,
      city,
      state,
      zip,
      'USA',
      probability,
      closingDate.toISOString(),
      closingPrice,
      '100', // commission portion
      'percent', // commission portion type
      closingPrice, // same as additional income
      'dollar',
      notes,
      whoInvolved
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
    console.log('LEAVE: ' + source);
    if (source == 'Relationships') {
      navigation.navigate('RelDetails', {
        contactId: whoInvolved?.id,
        firstName: whoInvolved?.firstName,
        lastName: whoInvolved?.lastName,
      });
    } else {
      navigation.navigate('RealEstateTransactions');
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

        <Text style={styles.nameTitle}>{'Amount (Projected)'}</Text>
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

        <Text style={styles.nameTitle}>Notes</Text>
        <View style={styles.mainContent}>
          <View style={styles.noteView}>
            <TextInput
              style={styles.noteText}
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
        <Text style={styles.summaryText}>Additional Income</Text>
        <Text style={styles.summaryText}>{'$' + closingPrice}</Text>
      </View>
    </View>
  );
}
