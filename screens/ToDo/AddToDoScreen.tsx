import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
  Button,
} from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useIsFocused } from '@react-navigation/native';
import { addNewToDo } from './api';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
//import DatePicker from 'react-native-date-picker';
import Attendees from '../ToDo/AttendeesScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { inlineStyles } from 'react-native-svg';

//import { RolodexDataProps } from './interfaces';

let deviceWidth = Dimensions.get('window').width;

export default function AddToDoScreen(props: any) {
  const { setModalVisible, title, onSave } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [toDoTitle, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState(false);
  const [recurrence, setRecurrence] = useState('Never');
  const [frequency, setFrequency] = useState('Every Week');
  const [untilType, setUntilType] = useState('Times');
  const [untilVal, setUntilVal] = useState('0');
  const [order, setOrder] = useState('First');
  const [reminder, setReminder] = useState('None');
  const [remindType, setRemindType] = useState('Text');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [sunday, setSunday] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const [mode, setMode] = useState('date');
  const [showTopDate, setShowTopDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const Sheets = {
    recurrenceSheet: 'filter_sheet_rec',
    untilSheet: 'filter_sheet_until',
    reminderSheet: 'filter_sheet_reminder',
    frequencyWeekSheet: 'filter_sheet_frequency_week',
    frequencyMonthSheet: 'filter_sheet_frequency_month',
    orderMenu: 'filter_sheet_order',
  };

  const recurrenceMenu = {
    Never: 'Never',
    Daily: 'Daily',
    'Everyday M-F': 'Everyday M-F',
    'Weekly on': 'Weekly on',
    'Monthly on the': 'Monthly on the',
    'Every _ of the month': 'Every _ of the month',
    Yearly: 'Yearly',
  };

  const untilTypeMenu = {
    Times: 'Times',
    Forever: 'Forever',
    Until: 'Until',
  };

  const reminderMenu = {
    None: 'None',
    '1 day before': '1 day before',
    '2 days before': '2 days before',
    '3 days before': '3 days before',
    '4 days before': '4 days before',
    '5 days before': '5 days before',
    '6 days before': '6 days before',
    '1 week before': '1 week before',
  };

  const frequencyWeekMenu = {
    'Every Week': 'Every Week',
    'Every 2 Weeks': 'Every 2 Weeks',
    'Every 3 Weeks': 'Every 3 Weeks',
    'Every 4 Weeks': 'Every 4 Weeks',
    'Every 8 Weeks': 'Every 8 Weeks',
    'Every 12 Weeks': 'Every 12 Weeks',
  };

  const frequencyMonthMenu = {
    'Every Month': 'Every Month',
    'Every 2 Months': 'Every 2 Months',
    'Every 3 Months': 'Every 3 Months',
    'Every 4 Months': 'Every 4 Months',
    'Every 5 Months': 'Every 5 Months',
    'Every 6 Months': 'Every 6 Months',
  };

  const orderMenu = {
    First: 'First',
    Second: 'Second',
    Third: 'Third',
    Fourth: 'Fourth',
    Last: 'Last',
  };

  const onDatePickerTopChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShowTopDate(false);
    setDate(currentDate);
  };

  const onDatePickerEndChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShowEndDate(false);
    setEndDate(currentDate);
  };

  const showDateTopMode = (currentMode: any) => {
    setShowTopDate(true);
    setMode(currentMode);
  };

  const showDateEndMode = (currentMode: any) => {
    console.log(currentMode);
    setShowEndDate(true);
    setMode(currentMode);
  };

  const showDateTopPicker = () => {
    console.log('show date picker top');
    showDateTopMode('date');
  };

  const showDateEndPicker = () => {
    console.log('show date picker end');
    showDateEndMode('date');
  };

  useEffect(() => {
    getDarkOrLightMode();
    getCurrentDay();
  }, [isFocused]);

  useEffect(() => {
    if (recurrence == 'Weekly on') {
      setFrequency(frequencyWeekMenu['Every Week']);
    } else {
      setFrequency(frequencyMonthMenu['Every Month']);
    }
  }, [recurrence]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function handleAttendeesPressed() {
    console.log('attendees pressed');
    setModalAttendeesVisible(!modalAttendeesVisible);
  }

  function getCurrentDay() {
    var today = date.getDay();
    console.log(today);
    switch (today) {
      case 0:
        setSunday(true);
        break;
      case 1:
        setMonday(true);
        break;
      case 2:
        setTuesday(true);
        break;
      case 3:
        setWednesday(true);
        break;
      case 4:
        setThursday(true);
        break;
      case 5:
        setFriday(true);
        break;
      case 6:
        setSaturday(true);
        break;
      default:
        break;
    }
  }

  function savePressed() {
    //  analytics.event(new Event('Relationships', 'Save Button', 'Pressed', 0));
    console.log(date.toDateString());
    console.log(date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }));
    console.log(date.toISOString());

    if (toDoTitle == '') {
      Alert.alert('Please enter a Title');
      return;
    }
    console.log('i am here');

    //  new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

    addNewToDo(
      toDoTitle,
      date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
      priority,
      location,
      notes,
      untilType,
      endDate.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
      untilVal,
      recurrence,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      2,
      2,
      2,
      0,
      0
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log('here 2' + res);
          setModalVisible(false);
          onSave();
        }
        //   setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function frequencyWeekMenuPressed() {
    console.log('frequency week pressed');
    SheetManager.show(Sheets.frequencyWeekSheet);
  }

  function frequencyMonthMenuPressed() {
    console.log('frequency month pressed');
    SheetManager.show(Sheets.frequencyMonthSheet);
  }

  function endMenuPressed() {
    console.log('untiltype pressed');
    SheetManager.show(Sheets.untilSheet);
  }

  function orderMenuPressed() {
    SheetManager.show(Sheets.orderMenu);
  }

  function recurrenceMenuPressed() {
    SheetManager.show(Sheets.recurrenceSheet);
  }

  function reminderMenuPressed() {
    SheetManager.show(Sheets.reminderSheet);
  }

  function sundayPressed() {
    setSunday(!sunday);
  }

  function mondayPressed() {
    setMonday(!monday);
  }

  function tuesdayPressed() {
    setTuesday(!tuesday);
  }

  function wednesdayPressed() {
    setWednesday(!wednesday);
  }

  function thursdayPressed() {
    setThursday(!thursday);
  }

  function fridayPressed() {
    setFriday(!friday);
  }

  function saturdayPressed() {
    setSaturday(!saturday);
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text style={styles.nameTitle}>Title</Text>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setTitle(text)}
              defaultValue={toDoTitle}
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>Date</Text>
        <TouchableOpacity onPress={showDateTopPicker}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {date.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {showTopDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            onChange={onDatePickerTopChange}
            display="spinner"
            textColor="white"
          />
        )}

        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="High Priority"
          textContainerStyle={{ marginLeft: 10 }}
          style={styles.checkBox}
          onPress={(isChecked: boolean) => {
            console.log(isChecked);
            setPriority(!priority);
          }}
        />

        <Text style={styles.nameTitle}>Recurrence</Text>
        <TouchableOpacity onPress={recurrenceMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {recurrence == recurrenceMenu['Monthly on the'] ? recurrence + ' ' + date.getDate() : recurrence}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {recurrence == recurrenceMenu['Every _ of the month'] && <Text style={styles.nameTitle}>Order</Text>}
        {recurrence == recurrenceMenu['Every _ of the month'] && (
          <TouchableOpacity onPress={orderMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {recurrence == recurrenceMenu['Every _ of the month'] ? order + ' ' + days[date.getDay()] : order}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Weekly on' && <Text style={styles.nameTitle}>Days</Text>}
        {recurrence == 'Weekly on' && (
          <View style={styles.mainContent}>
            <View style={styles.weekRow}>
              <Text style={sunday ? globalStyles.selected : globalStyles.unselected} onPress={sundayPressed}>
                S
              </Text>
              <Text style={monday ? globalStyles.selected : globalStyles.unselected} onPress={mondayPressed}>
                M
              </Text>
              <Text style={tuesday ? globalStyles.selected : globalStyles.unselected} onPress={tuesdayPressed}>
                T
              </Text>
              <Text style={wednesday ? globalStyles.selected : globalStyles.unselected} onPress={wednesdayPressed}>
                W
              </Text>
              <Text style={thursday ? globalStyles.selected : globalStyles.unselected} onPress={thursdayPressed}>
                T
              </Text>
              <Text style={friday ? globalStyles.selected : globalStyles.unselected} onPress={fridayPressed}>
                F
              </Text>
              <Text style={saturday ? globalStyles.selected : globalStyles.unselected} onPress={saturdayPressed}>
                S
              </Text>
            </View>
            <Text></Text>
          </View>
        )}

        {recurrence == 'Weekly on' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Weekly on' && (
          <TouchableOpacity onPress={frequencyWeekMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{frequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Monthly on the' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Monthly on the' && (
          <TouchableOpacity onPress={frequencyMonthMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{frequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Every _ of the month' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Every _ of the month' && (
          <TouchableOpacity onPress={frequencyMonthMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{frequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence != 'Never' && <Text style={styles.nameTitle}>End Type</Text>}
        {recurrence != 'Never' && (
          <TouchableOpacity onPress={endMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{untilType}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence != 'Never' && untilType == 'Times' && <Text style={styles.nameTitle}>Number of Times</Text>}
        {recurrence != 'Never' && untilType == 'Times' && (
          <View style={styles.untilRow}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                onChangeText={(text) => setUntilVal(text)}
                defaultValue={untilVal}
              />
            </View>
          </View>
        )}

        {recurrence != 'Never' && untilType == 'Until' && <Text style={styles.nameTitle}>End Date</Text>}
        {recurrence != 'Never' && untilType == 'Until' && (
          <TouchableOpacity onPress={showDateEndPicker}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {endDate.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {showEndDate && (
          <DateTimePicker
            testID="dateTimePicker2"
            value={endDate}
            mode={'date'}
            is24Hour={true}
            onChange={onDatePickerEndChange}
            display="spinner"
            textColor="white"
          />
        )}

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('recurrence sheet')}
          id={Sheets.recurrenceSheet}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(recurrenceMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.recurrenceSheet, null);
                      console.log('filter: ' + value);
                      setRecurrence(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('until val')}
          id={Sheets.untilSheet}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(untilTypeMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.untilSheet, null);
                      console.log('filter: ' + value);
                      setUntilType(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('reminder')}
          id={Sheets.reminderSheet}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(reminderMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.reminderSheet, null);
                      console.log('reminder: ' + value);
                      setReminder(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('frequency month')}
          id={Sheets.frequencyMonthSheet}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(frequencyMonthMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.frequencyMonthSheet, null);
                      console.log('frequency Month: ' + value);
                      setFrequency(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('frequency week')}
          id={Sheets.frequencyWeekSheet}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(frequencyWeekMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.frequencyWeekSheet, null);
                      console.log('frequency Week: ' + value);
                      setFrequency(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('order')}
          id={Sheets.orderMenu}
          ref={actionSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          bottomOffset={40}
          defaultOverlayOpacity={0.3}
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
              style={styles.filterView}
            >
              <View>
                {Object.entries(orderMenu).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      SheetManager.hide(Sheets.orderMenu, null);
                      console.log('order: ' + value);
                      setOrder(value);
                      // fetchData();
                    }}
                    style={styles.listItemCell}
                  >
                    <Text style={styles.listItem}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <Text style={styles.nameTitle}>Reminder</Text>

        <TouchableOpacity onPress={reminderMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{reminder}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* if T = true and E = False, and T is pressed, nothing should happen (T remains */}
        {/* true and E remains false.s */}

        {reminder != 'None' && (
          <View style={{ flexDirection: 'row', marginLeft: 0 }}>
            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              isChecked={remindType == 'Text'} // default
              unfillColor="#004F89"
              iconStyle={{ borderColor: 'white' }}
              text="Text"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setRemindType('Text');
              }}
            />

            <Text style={{ width: 20 }}></Text>

            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              unfillColor="#004F89"
              isChecked={remindType == 'Email'} // default
              iconStyle={{ borderColor: 'white' }}
              text="Email"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setRemindType('Email');
              }}
            />
          </View>
        )}

        <Text style={styles.nameTitle}>Location</Text>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setLocation(text)}
              defaultValue={location}
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>Attendees</Text>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.attendeeInput} onPress={handleAttendeesPressed}>
              + Add
            </Text>
          </View>
        </View>

        <Text style={styles.nameTitle}>Notes</Text>
        <View style={styles.mainContent}>
          <View style={lightOrDark == 'dark' ? styles.inputViewDark : styles.inputViewLight}>
            <TextInput
              style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
              placeholder="Type Here"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
          </View>
        </View>

        {modalAttendeesVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAttendeesVisible}
            onRequestClose={() => {
              setModalAttendeesVisible(!modalAttendeesVisible);
            }}
          >
            <Attendees title="Attendees" setModalAttendeesVisible={setModalAttendeesVisible} />
          </Modal>
        )}

        <View style={styles.footer}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    alignItems: 'center',
  },
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  filterView: {
    width: '100%',
    padding: 12,
  },
  footer: {
    // Can't scroll to bottom of Notes without this
    height: 250,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  untilRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  untilView: {
    backgroundColor: '#002341',
    width: '42%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },

  weekView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  notesView: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  attendeeInput: {
    fontSize: 18,
    color: 'silver',
    width: 300,
  },
  checkBox: {
    marginTop: 12,
    left: 0.055 * deviceWidth,
    marginBottom: 25,
  },
  inputViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInputDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  textInputLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
