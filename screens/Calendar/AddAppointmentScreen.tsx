import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { addNewAppointment } from './api';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Attendees from '../ToDo/AttendeesScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RolodexDataProps, AttendeesProps } from '../ToDo/interfaces';
import {
  convertFrequency,
  convertReminderTime,
  convertReminderUnit,
  recurrenceMenu,
  convertOrder,
  convertYearlyWeekNumber,
  convertRecurrence,
  frequencyMonthMenu,
  orderMenu,
  frequencyWeekMenu,
  frequencyYearMenu,
  untilTypeMenu,
  reminderUnitBeforeMenu,
  reminderTimeBeforeMenu,
} from '../Calendar/calendarHelpers';

export default function AddAppointmentScreen(props: any) {
  const { setModalVisible, title, onSave, guid, firstName, lastName } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [apptTitle, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [recurrence, setRecurrence] = useState('Never');
  const [weeklyFrequency, setWeeklyFrequency] = useState('Every Week');
  const [monthlyFrequency, setMonthlyFrequency] = useState('Every Month');
  const [yearlyFrequency, setYearlyFrequency] = useState('Every Year');
  const [untilType, setUntilType] = useState('Times');
  const [untilVal, setUntilVal] = useState('0');
  const [order, setOrder] = useState('First');
  const [reminderType, setReminderType] = useState('Text');
  const [reminderUnit, setReminderUnit] = useState('None');
  const [reminderTime, setReminderTime] = useState('10');
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
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const navigation = useNavigation();

  const [attendees, setAttendees] = useState<RolodexDataProps[]>([]);

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const Sheets = {
    recurrenceSheet: 'filter_sheet_rec',
    untilSheet: 'filter_sheet_until',
    reminderUnitSheet: 'filter_sheet_reminder_unit',
    reminderTimeSheet: 'filter_sheet_reminder_time',
    frequencyWeekSheet: 'filter_sheet_frequency_week',
    frequencyMonthSheet: 'filter_sheet_frequency_month',
    frequencyYearSheet: 'filter_sheet_frequency_year',
    orderMenu: 'filter_sheet_order',
  };

  const onDatePickerStartChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setStartDate(currentDate);
  };

  const onDatePickerToChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setToDate(currentDate);
  };

  const onDatePickerEndChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setEndDate(currentDate);
  };

  const showStartDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowFromDate(true);
  };

  const showToDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowToDate(true);
  };

  const showEndDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowEndDate(true);
  };

  const showStartDatePicker = () => {
    console.log('from picker');
    showStartDateMode('time');
  };

  const showToDatePicker = () => {
    showToDateMode('date');
  };

  const showEndDatePicker = () => {
    console.log('show date picker end');
    showEndDateMode('date');
  };

  function handleRecurrenceChange() {
    if (reminderType == 'None') {
      setReminderType('none');
    } else {
      if (reminderType != 'text' && reminderType != 'email') {
        setReminderType('text');
      }
    }
  }

  useEffect(() => {
    console.log('USEEFFECT:' + tuesday);
  }, [
    navigation,
    reminderTime,
    reminderUnit,
    reminderType,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  ]);

  useEffect(() => {
    handleRecurrenceChange();
  }, [reminderType, reminderTime, reminderUnit, reminderType]);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    getCurrentDay();
  }, [isFocused]);

  useEffect(() => {
    if (guid != null) {
      var rel: RolodexDataProps = {
        id: guid,
        firstName: firstName,
        lastName: lastName,
        ranking: '',
        contactTypeID: '',
        employerName: '',
        selected: false,
        qualified: false,
      };
      attendees.push(rel);
    }
  }, [isFocused]);

  useEffect(() => {
    if (recurrence == 'Weekly on') {
      setWeeklyFrequency(frequencyWeekMenu['Every Week']);
    } else if (recurrence == 'Month on the') {
      setMonthlyFrequency(frequencyMonthMenu['Every Month']);
    } else {
      setYearlyFrequency(frequencyYearMenu['Every Year']);
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

  function handleSelectedAttendees(selected: RolodexDataProps[]) {
    var toBeRemoved = new Array();
    const combined = [...attendees, ...selected];
    combined.forEach((item, index) => {
      // remove duplicates
      console.log('in loop');
      console.log(attendees);
      combined.forEach((item2, index2) => {
        console.log('in 2nd loop');
        console.log('item id: ' + item.id);
        console.log('item2 id: ' + item2.id);
        if (item.id == item2.id && index != index2) combined.splice(index2, 1);
      });
    });

    console.log('to be added: ' + toBeRemoved.length);
    setAttendees(combined);
  }

  function deleteAttendee(index: number) {
    console.log(index);
    attendees.splice(index, 1);
    const newAttendees = [...attendees, ...[]];
    console.log(attendees.length);
    setAttendees(newAttendees);
  }

  function getCurrentDay() {
    var today = startDate.getDay();
    console.log('TODAY: ' + today);
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
    console.log(startDate.toDateString());
    console.log(
      startDate.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
    );
    console.log(startDate.toISOString());

    console.log('times: ' + untilType);
    if (recurrence != 'Never' && untilType == 'Times') {
      if (untilVal == '0') {
        Alert.alert('The number of times must be greater than 0');
        return;
      }
    }
    if (apptTitle == '') {
      Alert.alert('Please enter a Title');
      return;
    }

    var newAttendees = new Array();
    attendees.forEach((item, index) => {
      var attendeeProps: AttendeesProps = {
        id: item.id,
        name: item.firstName,
      };
      newAttendees.push(attendeeProps);
    });

    //  new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    //  console.log(attendees[0].id);
    console.log('reminderTime ' + reminderTime);
    console.log('reminder type: ' + reminderType);
    console.log('reminder before unit: ' + convertReminderUnit(reminderUnit));
    console.log('tuesday: ' + tuesday);

    //   console.log('until val: ' + untilVal);
    //   console.log('recurrence: ' + convertRecurrence(recurrence));

    addNewAppointment(
      apptTitle,
      startDate.toISOString(),
      toDate.toISOString(),
      location,
      notes,
      untilType,
      endDate.toISOString(),
      untilVal,
      convertRecurrence(recurrence),
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      convertFrequency(weeklyFrequency), // weeklyeverynweeks
      convertFrequency(monthlyFrequency), // monthlyeverynmonths
      convertOrder(order),
      convertYearlyWeekNumber('2'),
      convertFrequency(yearlyFrequency), // yearlyeverynyears
      convertReminderTime(reminderTime), // timeBefore
      convertReminderUnit(reminderUnit), // beforeUnit
      reminderType,
      newAttendees
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log('HERE2 ' + res.data.id);
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

  function frequencYearMenuPressed() {
    console.log('frequency year pressed');
    SheetManager.show(Sheets.frequencyYearSheet);
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

  function reminderUnitMenuPressed() {
    SheetManager.show(Sheets.reminderUnitSheet);
  }

  function reminderTimeMenuPressed() {
    SheetManager.show(Sheets.reminderTimeSheet);
  }

  function sundayPressed() {
    setSunday(!sunday);
  }

  function mondayPressed() {
    setMonday(!monday);
  }

  function tuesdayPressed() {
    console.log('TUES: ' + tuesday);
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
              defaultValue={apptTitle}
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>From</Text>
        <TouchableOpacity onPress={showStartDatePicker}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {startDate.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {showFromDate && (
          <TouchableOpacity
            onPress={() => {
              setShowFromDate(false);
            }}
          >
            <Text style={styles.saveButton}>Close</Text>
          </TouchableOpacity>
        )}

        {showFromDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={'date'}
            is24Hour={true}
            onChange={onDatePickerStartChange}
            display="spinner"
            textColor="white"
          />
        )}

        <Text style={styles.nameTitle}>To</Text>
        <TouchableOpacity onPress={showToDatePicker}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {toDate.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {showToDate && (
          <TouchableOpacity
            onPress={() => {
              setShowToDate(false);
            }}
          >
            <Text style={styles.saveButton}>Close</Text>
          </TouchableOpacity>
        )}

        {showToDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={toDate}
            mode={'date'}
            is24Hour={true}
            onChange={onDatePickerToChange}
            display="spinner"
            textColor="white"
          />
        )}

        <Text style={styles.nameTitle}>Recurrence</Text>
        <TouchableOpacity onPress={recurrenceMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {recurrence == recurrenceMenu['Monthly on the'] ? recurrence + ' ' + startDate.getDate() : recurrence}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {recurrence == recurrenceMenu['Every _ week of the month'] && <Text style={styles.nameTitle}>Order</Text>}
        {recurrence == recurrenceMenu['Every _ week of the month'] && (
          <TouchableOpacity onPress={orderMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {recurrence == recurrenceMenu['Every _ week of the month']
                    ? order + ' ' + days[startDate.getDay()]
                    : order}
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

        {recurrence == 'Yearly' && <Text style={styles.nameTitle}>On</Text>}
        {recurrence == 'Yearly' && (
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {recurrence == recurrenceMenu['Yearly']
                  ? startDate.getMonth() + 1 + '/' + startDate.getDate()
                  : recurrence}
              </Text>
            </View>
          </View>
        )}

        {recurrence == 'Weekly on' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Weekly on' && (
          <TouchableOpacity onPress={frequencyWeekMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{weeklyFrequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Monthly on the' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Monthly on the' && (
          <TouchableOpacity onPress={frequencyMonthMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{monthlyFrequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Yearly' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Yearly' && (
          <TouchableOpacity onPress={frequencYearMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{yearlyFrequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {recurrence == 'Every _ of the month' && <Text style={styles.nameTitle}>Frequency</Text>}
        {recurrence == 'Every _ of the month' && (
          <TouchableOpacity onPress={frequencyMonthMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{monthlyFrequency}</Text>
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
                keyboardType="number-pad"
              />
            </View>
          </View>
        )}

        {recurrence != 'Never' && untilType == 'Until' && <Text style={styles.nameTitle}>End Date</Text>}
        {recurrence != 'Never' && untilType == 'Until' && (
          <TouchableOpacity onPress={showEndDatePicker}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {endDate.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {showEndDate && (
          <TouchableOpacity
            onPress={() => {
              setShowEndDate(false);
            }}
          >
            <Text style={styles.saveButton}>Close</Text>
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

        <ActionSheet // recurrence
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
                {Object.entries(recurrenceMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.recurrenceSheet, null);
                      console.log('filter: ' + value);
                      setRecurrence(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // until type
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('until type')}
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
                {Object.entries(untilTypeMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.untilSheet, null);
                      console.log('filter: ' + value);
                      setUntilType(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // reminder unit
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('reminder unit')}
          id={Sheets.reminderUnitSheet}
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
                {Object.entries(reminderUnitBeforeMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.reminderUnitSheet, null);
                      console.log('reminder: ' + value);
                      setReminderUnit(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // reminder time
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('reminder time')}
          id={Sheets.reminderTimeSheet}
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
                {Object.entries(reminderTimeBeforeMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.reminderTimeSheet, null);
                      console.log('reminder: ' + value);
                      setReminderTime(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // monthly
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
                {Object.entries(frequencyMonthMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.frequencyMonthSheet, null);
                      console.log('frequency Month: ' + value);
                      setMonthlyFrequency(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // weekly
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
                {Object.entries(frequencyWeekMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.frequencyWeekSheet, null);
                      console.log('frequency Week: ' + value);
                      setWeeklyFrequency(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // order
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
                {Object.entries(orderMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.orderMenu, null);
                      console.log('order: ' + value);
                      setOrder(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <ActionSheet // yearly
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('frequency yearly')}
          id={Sheets.frequencyYearSheet}
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
                {Object.entries(frequencyYearMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(Sheets.frequencyYearSheet, null);
                      console.log('frequency monthly: ' + value);
                      setYearlyFrequency(value);
                      // fetchData();
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{index}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
            </ScrollView>
          </View>
        </ActionSheet>

        <Text style={styles.nameTitle}>Reminder Unit</Text>
        <TouchableOpacity onPress={reminderUnitMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{reminderUnit}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {reminderUnit != 'None' && <Text style={styles.nameTitle}>Reminder Time Before</Text>}
        {reminderUnit != 'None' && (
          <TouchableOpacity onPress={reminderTimeMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>{reminderTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {reminderUnit != 'None' && (
          <View style={{ flexDirection: 'row', marginLeft: 0 }}>
            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              isChecked={reminderType == 'text'} // default
              unfillColor="#004F89"
              iconStyle={{ borderColor: 'white' }}
              text="Text"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setReminderType('text');
              }}
            />

            <Text style={{ width: 20 }}></Text>

            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              unfillColor="#004F89"
              isChecked={reminderType == 'email'} // default
              iconStyle={{ borderColor: 'white' }}
              text="Email"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setReminderType('email');
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
        {attendees.map((item, index) => (
          <View style={styles.mainContent}>
            <View style={styles.attendeeView}>
              <Text style={styles.attendeeInput}>{item.firstName}</Text>
              <TouchableOpacity onPress={() => deleteAttendee(index)}>
                <Image source={closeButton} style={styles.deleteAttendeeX} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.addAttendee} onPress={handleAttendeesPressed}>
              + Add
            </Text>
          </View>
        </View>

        <Text style={styles.nameTitle}>Notes</Text>
        <View style={styles.mainContent}>
          <View style={styles.notesView}>
            <TextInput
              style={styles.notesInput}
              placeholder="Type Here"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
          </View>
        </View>
        <Text></Text>
        {modalAttendeesVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAttendeesVisible}
            onRequestClose={() => {
              setModalAttendeesVisible(!modalAttendeesVisible);
            }}
          >
            <Attendees
              title="Attendees"
              setModalAttendeesVisible={setModalAttendeesVisible}
              setSelectedAttendees={handleSelectedAttendees}
            />
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
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  attendeeView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    fontSize: 29,
    flexDirection: 'row',
  },
  attendeeInput: {
    fontSize: 18,
    color: 'silver',
    marginTop: 10,
    paddingLeft: 10,
    width: '92%',
  },
  addAttendee: {
    fontSize: 18,
    color: 'silver',
    width: 300,
  },
  deleteAttendeeX: {
    width: 10,
    height: 10,
  },
  checkBox: {
    marginTop: 12,
    left: 20,
    marginBottom: 25,
  },
  notesView: {
    marginTop: 10,
    backgroundColor: '#002341',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  notesInput: {
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
