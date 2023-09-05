import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { addNewAppointment } from './api';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Attendees from '../ToDo/AttendeesScreen';
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
  apptStartDateLabel,
  apptStartTimeLabel,
  apptEndDateLabel,
  apptEndTimeLabel,
} from '../Calendar/calendarHelpers';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const closeButton = require('../../images/button_close_white.png');

export default function AddAppointmentScreen(props: any) {
  const { setModalVisible, title, onSave, guid, firstName, lastName } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [apptTitle, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [untilDate, setUntilDate] = useState(new Date());
  const [recurrence, setRecurrence] = useState('Never');
  const [weeklyFrequency, setWeeklyFrequency] = useState('Every Week');
  const [monthlyFrequency, setMonthlyFrequency] = useState('Every Month');
  const [yearlyFrequency, setYearlyFrequency] = useState('Every Year');
  const [untilType, setUntilType] = useState('Times');
  const [untilVal, setUntilVal] = useState('0');
  const [order, setOrder] = useState('First');
  const [reminderType, setReminderType] = useState('Text');
  const [reminderUnit, setReminderUnit] = useState('None');
  const [reminderTime, setReminderTime] = useState('0');
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
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showUntilDate, setShowUntilDate] = useState(false);
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const navigation = useNavigation();
  const [attendees, setAttendees] = useState<RolodexDataProps[]>([]);
  const notesInputRef = useRef<TextInput>(null);

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

  const handleConfirmStartDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setStartDate(currentDate);
    setShowStartDate(false);
  };

  const handleConfirmStartTime = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setStartDate(currentDate);
    setShowStartTime(false);
  };

  const handleConfirmEndDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setEndDate(currentDate);
    setShowEndDate(false);
  };

  const handleConfirmEndTime = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setEndDate(currentDate);
    setShowEndTime(false);
  };

  const handleConfirmUntilDate = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setUntilDate(currentDate);
    setShowUntilDate(false);
  };

  const showStartDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowStartDate(true);
  };

  const showStartTimeMode = (currentMode: any) => {
    console.log(currentMode);
    setShowStartTime(true);
  };

  const showEndDateMode = (currentMode: any) => {
    console.log(currentMode);
    setShowEndDate(true);
  };

  const showEndTimeMode = (currentMode: any) => {
    console.log(currentMode);
    setShowEndTime(true);
  };

  const showUntilDateMode = (currentMode: any) => {
    console.log('until mode');
    setShowUntilDate(true);
  };

  function hideStartDatePicker() {
    setShowStartDate(false);
  }

  function hideStartTimePicker() {
    setShowStartTime(false);
  }

  function hideEndDatePicker() {
    setShowEndDate(false);
  }

  function hideEndTimePicker() {
    setShowEndTime(false);
  }

  function hideUntilPicker() {
    setShowUntilDate(false);
  }

  function handleRecurrenceChange() {
    if (reminderType == 'None') {
      setReminderType('none');
    } else {
      if (reminderType != 'text' && reminderType != 'email') {
        setReminderType('text');
      }
    }
  }

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  useEffect(() => {
    handleRecurrenceChange();
  }, [reminderType, reminderTime, reminderUnit, reminderType]);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    getCurrentDay();
    setEndDate(new Date(startDate.getTime() + 60 * 60 * 1000));
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

  function isStringNumeric(input: string) {
    return /^\d+$/.test(input);
  }

  function savePressed() {
    if (apptTitle == '') {
      Alert.alert('Please Enter a Title');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('The Start Date and Time must be before the End Date and Time');
      return;
    }
    if (recurrence != 'Never' && untilType == 'Times') {
      if (untilVal == '0') {
        Alert.alert('The number of times must be greater than 0');
        return;
      }
    }
    if (reminderUnit != 'None') {
      if (!isStringNumeric(reminderTime)) {
        Alert.alert('"Reminder Time Before" must be a positive number');
        return;
      }
    }
    if (reminderUnit != 'None') {
      if (reminderTime == '') {
        Alert.alert('"Reminder Time" must be a positive number');
        return;
      }
    }
    if (reminderUnit == 'Minutes') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 999) {
        Alert.alert('"Reminder Time Before" must be 999 or less');
        return;
      }
    }
    if (reminderUnit == 'Hours') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 99) {
        Alert.alert('"Reminder Time Before" must be 99 or less');
        return false;
      }
    }
    if (reminderUnit == 'Days') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 365) {
        Alert.alert('"Reminder Time Before" must be 365 or less');
        return false;
      }
    }
    if (reminderUnit == 'Weeks') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 52) {
        Alert.alert('"Reminder Time Before" must be 52 or less');
        return false;
      }
    }

    var newAttendees = new Array();
    attendees.forEach((item, index) => {
      var attendeeProps: AttendeesProps = {
        id: item.id,
        name: item.firstName,
      };
      newAttendees.push(attendeeProps);
    });

    console.log('recurrence: ' + recurrence);
    console.log('recurrence converted: ' + convertRecurrence(recurrence));
    console.log('untilDate.toISOString(): ' + untilDate.toISOString());
    console.log('untilType: ' + untilType);
    console.log('untilVal: ' + untilVal);

    var newUntilDate = untilDate.toISOString();
    if (untilType == 'Times' || untilType == 'Forever') {
      newUntilDate = '2052-11-19T00:00:00';
    }

    addNewAppointment(
      apptTitle,
      startDate.toISOString(),
      endDate.toISOString(),
      location,
      notes,
      untilType,
      newUntilDate,
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

  function isDataValid() {
    if (apptTitle == '') {
      return false;
    }
    if (startDate > endDate) {
      return false;
    }
    console.log(startDate.toDateString());
    console.log(
      startDate.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
    );
    console.log(startDate.toISOString());
    console.log('times: ' + untilType);
    if (reminderUnit != 'None') {
      if (reminderTime == '') {
        return false;
      }
    }
    if (reminderUnit != 'None') {
      if (!isStringNumeric(reminderTime)) {
        return false;
      }
    }
    if (reminderUnit == 'Minutes') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 999) {
        return false;
      }
    }
    if (reminderUnit == 'Hours') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 99) {
        return false;
      }
    }
    if (reminderUnit == 'Days') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 365) {
        return false;
      }
    }
    if (reminderUnit == 'Weeks') {
      if (parseFloat(reminderTime) < 0 || parseFloat(reminderTime) > 52) {
        return false;
      }
    }
    return true;
  }

  function recurrenceText() {
    if (recurrence == recurrenceMenu['Yearly']) {
      return 'Yearly on ' + (startDate.getMonth() + 1).toString() + '/' + startDate.getDate();
    }
    if (recurrence == recurrenceMenu['Monthly on the']) {
      return recurrence + ' ' + startDate.getDate() + recurrenceSuffix(startDate.getDate());
    }
    return recurrence;
  }

  function recurrenceSuffix(input: number) {
    if (input == 1 || input == 21 || input == 31) {
      return 'st';
    }
    if (input == 2 || input == 22) {
      return 'nd';
    }
    if (input == 3 || input == 23) {
      return 'rd';
    }
    return 'th';
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={globalStyles.cancelButton}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={isDataValid() ? styles.saveButton : styles.saveButtonDim}>Save</Text>
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

        <Text style={styles.nameTitle}>{apptStartDateLabel}</Text>
        <TouchableOpacity onPress={showStartDateMode}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {startDate.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showStartDate}
          date={startDate}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={hideStartDatePicker}
        />

        <Text style={styles.nameTitle}>{apptStartTimeLabel}</Text>
        <TouchableOpacity onPress={showStartTimeMode}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {startDate.toLocaleTimeString('en-us', {
                  hour12: true,
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showStartTime}
          date={startDate}
          mode="time"
          onConfirm={handleConfirmStartTime}
          onCancel={hideStartTimePicker}
        />

        <Text style={styles.nameTitle}>{apptEndDateLabel}</Text>
        <TouchableOpacity onPress={showEndDateMode}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {endDate.toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showEndDate}
          date={endDate}
          mode="date"
          onConfirm={handleConfirmEndDate}
          onCancel={hideEndDatePicker}
        />

        <Text style={styles.nameTitle}>{apptEndTimeLabel}</Text>
        <TouchableOpacity onPress={showEndTimeMode}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {endDate.toLocaleTimeString('en-us', {
                  hour12: true,
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showEndTime}
          date={endDate}
          mode="time"
          onConfirm={handleConfirmEndTime}
          onCancel={hideEndTimePicker}
        />

        <Text style={styles.nameTitle}>Recurrence</Text>
        <TouchableOpacity onPress={recurrenceMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{recurrenceText()}</Text>
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

        {recurrence != 'Never' && untilType == 'Until' && <Text style={styles.nameTitle}>Until Date</Text>}
        {recurrence != 'Never' && untilType == 'Until' && (
          <TouchableOpacity onPress={showUntilDateMode}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {untilDate.toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <DateTimePickerModal
          isVisible={showUntilDate}
          mode="date"
          date={untilDate}
          onConfirm={handleConfirmUntilDate}
          onCancel={hideUntilPicker}
        />

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
                      setRecurrence(value); // frequencyType
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
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder="+ Add"
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                onChangeText={(text) => setReminderTime(text)}
                defaultValue={reminderTime}
                keyboardType="number-pad"
              />
            </View>
          </View>
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

        <Text style={styles.nameTitle}>Relationships</Text>
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
              title="Relationships"
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
    height: 500,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
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
    opacity: 1.0,
  },
  saveButtonDim: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
    opacity: 0.4,
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
  textInputLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
