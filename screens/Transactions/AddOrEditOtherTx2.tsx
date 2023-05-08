import { Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect, useState } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { AddTxBuyerAndSellerSheets, probabilityMenu, styles } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditOtherTransaction } from './api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddOrEditOtherTx2(props: any) {
  const { route } = props;
  const { data, status, type, title, whoInvolved, street1, street2, city, state, zip, source } = route.params;
  const isFocused = useIsFocused();
  const [probability, setProbability] = useState('Uncertain');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [closingPrice, setClosingPrice] = useState('800');
  const [closingDate, setClosingDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();
  const notesInputRef = useRef<TextInput>(null);

  useEffect(() => {
    var now = new Date();
    const timeString = now.toLocaleTimeString();
    setNotes('Notes: ' + timeString.toString());
    //  console.log('contacts from previous screen: ' + whoInvolved[0].id);
  }, [isFocused]);

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
  }, [navigation, probability, closingDate, whoInvolved, closingPrice, notes, data]);

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

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

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
    var newStreet1 = '';
    if (street1 == null || street1 == '' || street1 == 'TBD') {
      newStreet1 = 'TBD';
    }
    //  console.log('who: ' + whoInvolved[0].id);
    addOrEditOtherTransaction(
      data == null ? 0 : data?.id,
      type,
      status,
      title,
      newStreet1,
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
      navigation.popToTop();
      navigation.navigate('Home');
      navigation.navigate('OtherTransactionsMenu', { screen: 'OtherTransactions' });
    }
  }

  function probabilityPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.probabilitySheet);
  }

  const handleConfirm = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setClosingDate(currentDate);
    setShowDate(false);
  };

  const showDatePicker = (currentMode: any) => {
    console.log(currentMode);
    setShowDate(true);
  };

  function hideDatePicker() {
    setShowDate(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.topContainer}>
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

        <Text style={styles.nameTitle}>{'Amount* (Projected)'}</Text>
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
        <TouchableOpacity onPress={showDatePicker}>
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

        <DateTimePickerModal isVisible={showDate} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />

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
        <View style={styles.footer}></View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Text style={styles.summaryText}>Additional Income</Text>
        <Text style={styles.summaryText}>{'$' + closingPrice}</Text>
      </View>
    </View>
  );
}
