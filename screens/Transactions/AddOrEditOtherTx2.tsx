import { Text, View, TouchableOpacity, ScrollView, Alert, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRef, useEffect, useState } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import { probabilityMenu } from './transactionHelpers';
import { storage } from '../../utils/storage';
import { addOrEditOtherTransaction } from './api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { shouldRunTests } from '../../utils/general';
import { txStyles2 } from './styles';
import { useActionSheet } from '@expo/react-native-action-sheet';

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
  const navigation = useNavigation<any>();
  const notesInputRef = useRef<TextInput>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    var now = new Date();
    const timeString = now.toLocaleTimeString();
    // setNotes('Notes: ' + timeString.toString());
    //  console.log('contacts from previous screen: ' + whoInvolved[0].id);
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Other Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={txStyles2.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={completePressed}>
          <Text style={isDataValid() ? txStyles2.backAndNext : txStyles2.backAndNextDim}>Complete</Text>
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

  useEffect(() => {
    if (shouldRunTests()) {
      setClosingPrice('450000');
    }
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
    if (closingPrice == '' || closingPrice == null) {
      return false;
    }
    if (closingDate == null) {
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
    if (closingPrice == '' || closingPrice == null) {
      Alert.alert('Please enter a Projected Amount');
      return;
    }
    if (closingDate == null) {
      Alert.alert('Please enter a Projected Closing Data');
      return false;
    }
    if (shouldRunTests()) {
      if (closingPrice == '450000') {
        Alert.alert('Test Passed');
      } else {
        Alert.alert('Test Failed');
      }
    }
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
        contactId: whoInvolved[0].id,
        firstName: whoInvolved[0].firstName,
        lastName: whoInvolved[0].lastName,
      });
    } else {
      navigation.popToTop();
      navigation.navigate('Home');
      navigation.navigate('OtherTransactionsMenu', { screen: 'OtherTransactions' });
    }
  }

  const probabilityPressed = () => {
    const options = probabilityMenu;
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
    <View style={txStyles2.container}>
      <ScrollView style={txStyles2.topContainer}>
        <Text style={txStyles2.nameTitle}>Probability to Close</Text>
        <TouchableOpacity onPress={probabilityPressed}>
          <View style={txStyles2.mainContent}>
            <View style={txStyles2.inputView}>
              <Text style={txStyles2.textInput}>{probability}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={txStyles2.nameTitle}>{'Projected Amount *'}</Text>
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
        <TouchableOpacity onPress={showDatePicker}>
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

        <DateTimePickerModal isVisible={showDate} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />

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
        <View style={txStyles2.footer}></View>
      </ScrollView>

      <View style={txStyles2.bottomContainer}>
        <Text style={txStyles2.summaryText}>Additional Income</Text>
        <Text style={txStyles2.summaryText}>{'$' + closingPrice}</Text>
      </View>
    </View>
  );
}
