import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useIsFocused } from '@react-navigation/native';
import { addNewToDo } from './api';
import globalStyles from '../../globalStyles';
import Attendees from '../ToDo/AttendeesScreen';
import { RolodexDataProps, AttendeesProps } from './interfaces';
import {
  days,
  convertFrequency,
  convertReminder,
  recurrenceMenu,
  convertOrder,
  convertYearlyWeekNumber,
  convertRecurrence,
  untilTypeMenu,
  reminderMenu,
  frequencyMonthMenu,
  frequencyWeekMenu,
  frequencyYearMenu,
  orderMenu,
} from './toDoHelpers';
import { ga4Analytics } from '../../utils/general';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GoalDataConciseProps } from '../Goals/interfaces';
import ChooseGoal from '../Goals/ChooseGoalScreen';
import { useActionSheet } from '@expo/react-native-action-sheet';
const closeButton = require('../../images/button_close_white.png');

export default function AddToDoScreen(props: any) {
  const { setModalVisible, title, onSave, guid, firstName, lastName, lightOrDark } = props;
  const [toDoTitle, setTitle] = useState('');
  const [goal, setGoal] = useState<GoalDataConciseProps>();
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState('False');
  const [recurrence, setRecurrence] = useState('Never');
  const [weeklyFrequency, setWeeklyFrequency] = useState('Every Week');
  const [monthlyFrequency, setMonthlyFrequency] = useState('Every Month');
  const [yearlyFrequency, setYearlyFrequency] = useState('Every Year');
  const [untilType, setUntilType] = useState('Until');
  const [untilVal, setUntilVal] = useState('0');
  const [order, setOrder] = useState('First');
  const [reminder, setReminder] = useState('None');
  const [remindType, setRemindType] = useState('none');
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
  const [showTopDate, setShowTopDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  const [attendees, setAttendees] = useState<RolodexDataProps[]>([]);
  const notesInputRef = useRef<TextInput>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  function formatActivity(ugly: string) {
    if (goal == null || goal.title == 'None') {
      return 'Select (Optional)';
    }
    if (ugly == 'Calls Made') {
      return 'Call Made';
    }
    if (ugly == 'Referrals Given') {
      return 'Referral Tracked';
    }
    if (ugly == 'Notes Made') {
      return 'Note Written';
    }
    return ugly;
  }

  const handleConfirmTop = (selectedDate: any) => {
    const currentDate = selectedDate;
    //todo dates don't need time information, we will set time to 0:00 for local timezone
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate.toISOString());
    setDate(currentDate);
    setShowTopDate(false);
  };

  const handleConfirmEnd = (selectedDate: any) => {
    var currentDate = selectedDate;
    //todo dates don't need time information, we will set time to 0:00 for local timezone
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);
    setEndDate(currentDate);
    setShowEndDate(false);
  };

  const showDateTopMode = (currentMode: any) => {
    console.log(currentMode);
    setShowTopDate(true);
  };

  const showDateEndMode = (currentMode: any) => {
    console.log(currentMode);
    setShowEndDate(true);
  };

  function hideDatePickerTop() {
    setShowTopDate(false);
  }

  function hideDatePickerEnd() {
    setShowEndDate(false);
  }

  function handleRecurrenceChange() {
    if (reminder == 'None') {
      setRemindType('none');
    } else {
      if (reminder != 'text' && reminder != 'email') {
        setRemindType('text');
      }
    }
  }

  useEffect(() => {
    handleRecurrenceChange();
  }, [reminder]);

  useEffect(() => {
    let isMounted = true;
    getCurrentDay(isMounted);
    var initialGoal: GoalDataConciseProps = {
      id: 0,
      title: 'Select (Optional)',
    };
    setGoal(initialGoal);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    date.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  }, []);

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
    console.log('recurrence:' + recurrence);
    if (recurrence == 'Weekly on') {
      setWeeklyFrequency('Every Week');
    } else if (recurrence == 'Month on the') {
      setMonthlyFrequency('Every Month');
    } else {
      setYearlyFrequency('Every Year');
    }
  }, [recurrence]);

  function handleAttendeesPressed() {
    console.log('attendees pressed');
    setModalAttendeesVisible(!modalAttendeesVisible);
    //console.log(JSON.stringify(attendees));
  }

  function handleGoalPressed() {
    setModalGoalVisible(!modalGoalVisible);
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
    //   console.log(attendees.length);
    setAttendees(newAttendees);
  }

  function getCurrentDay(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
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

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  function recurrenceText() {
    if (recurrence == 'Yearly') {
      return 'Yearly on ' + (date.getMonth() + 1).toString() + '/' + date.getDate();
    }
    if (recurrence == 'Monthly on the') {
      return recurrence + ' ' + date.getDate() + recurrenceSuffix(date.getDate());
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

  function savePressed() {
    ga4Analytics('To_Do_Save_New', {
      contentType: 'none',
      itemId: 'id1205',
    });
    console.log(date.toDateString());
    console.log(date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }));
    console.log(date.toISOString());

    console.log('times: ' + untilType);
    if (toDoTitle == '') {
      Alert.alert('Please enter a Title');
      return;
    }
    if (untilType == 'Times') {
      if (untilVal == '0') {
        Alert.alert('The number of times must be greater than 0');
        return;
      }
    }

    console.log('i am here');

    var newAttendees = new Array();
    attendees.forEach((item, index) => {
      var attendeeProps: AttendeesProps = {
        id: item.id,
        name: item.firstName,
      };
      newAttendees.push(attendeeProps);
    }); // branch.

    //  new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    //  console.log(attendees[0].id);
    console.log(' i am here ' + convertReminder(reminder));
    console.log('order: ' + order);
    console.log('until type: ' + untilType);
    console.log('until val: ' + untilVal);
    console.log('goal id: ' + goal?.id!);

    var newEndDate = endDate.toISOString();
    if (untilType == 'Times' || untilType == 'Forever') {
      console.log('until type: ' + untilType);
      newEndDate = '2052-11-19T00:00:00';
    }

    addNewToDo(
      toDoTitle,
      goal?.id!,
      //date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
      date.toISOString(),
      priority,
      location,
      notes,
      untilType,
      newEndDate,
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
      convertReminder(reminder),
      remindType,
      newAttendees
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

  const frequencyWeekMenuPressed = () => {
    const options = frequencyWeekMenu;
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
          setWeeklyFrequency(options[selectedIndex!]);
        }
      }
    );
  };

  const frequencyMonthMenuPressed = () => {
    const options = frequencyMonthMenu;
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
          setMonthlyFrequency(options[selectedIndex!]);
        }
      }
    );
  };

  const frequencyYearMenuPressed = () => {
    const options = frequencyYearMenu;
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
          setYearlyFrequency(options[selectedIndex!]);
        }
      }
    );
  };

  const endMenuPressed = () => {
    const options = untilTypeMenu;
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
          setUntilType(options[selectedIndex!]);
        }
      }
    );
  };

  const orderMenuPressed = () => {
    const options = orderMenu;
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
          setOrder(options[selectedIndex!]);
        }
      }
    );
  };

  const recurrenceMenuPressed = () => {
    const options = recurrenceMenu;
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
          setRecurrence(options[selectedIndex!]);
        }
      }
    );
  };

  const reminderMenuPressed = () => {
    const options = reminderMenu;
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
          setReminder(options[selectedIndex!]);
        }
      }
    );
  };

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

  function isDataValid() {
    if (toDoTitle == '') {
      return false;
    }
    return true;
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
              defaultValue={toDoTitle}
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>Activity</Text>
        <TouchableOpacity onPress={handleGoalPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <TextInput
                onPressIn={handleGoalPressed}
                editable={false}
                placeholder="+ Add"
                placeholderTextColor="#AFB9C2"
                style={styles.nameLabel}
              >
                {formatActivity(goal?.title!)}
              </TextInput>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.nameTitle}>Date</Text>
        <TouchableOpacity onPress={showDateTopMode}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>
                {date.toLocaleDateString('en-us', {
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
          isVisible={showTopDate}
          mode="date"
          date={date}
          onConfirm={handleConfirmTop}
          onCancel={hideDatePickerTop}
        />

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
            setPriority(priority == 'True' ? 'False' : 'True');
          }}
        />

        <Text style={styles.nameTitle}>Recurrence</Text>
        <TouchableOpacity onPress={recurrenceMenuPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{recurrenceText()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {recurrence == 'Every _ week of the month' && <Text style={styles.nameTitle}>Order</Text>}
        {recurrence == 'Every _ week of the month' && (
          <TouchableOpacity onPress={orderMenuPressed}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {recurrence == 'Every _ week of the month' ? order + ' ' + days[date.getDay()] : order}
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
          <TouchableOpacity onPress={frequencyYearMenuPressed}>
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
          <TouchableOpacity onPress={showDateEndMode}>
            <View style={styles.mainContent}>
              <View style={styles.inputView}>
                <Text style={styles.textInput}>
                  {endDate.toLocaleDateString('en-us', {
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

        <DateTimePickerModal
          isVisible={showEndDate}
          mode="date"
          date={endDate}
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePickerEnd}
        />

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
              isChecked={remindType == 'text'} // default
              unfillColor="#004F89"
              iconStyle={{ borderColor: 'white' }}
              text="Text"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setRemindType('text');
              }}
            />

            <Text style={{ width: 20 }}></Text>

            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              unfillColor="#004F89"
              isChecked={remindType == 'email'} // default
              iconStyle={{ borderColor: 'white' }}
              text="Email"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              disableBuiltInState={true}
              onPress={(isChecked: boolean) => {
                setRemindType('email');
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
              <TouchableOpacity key={index} onPress={() => deleteAttendee(index)}>
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
              title="Select Relationships"
              setModalAttendeesVisible={setModalAttendeesVisible}
              setSelectedAttendees={handleSelectedAttendees}
              attendees={attendees}
              lightOrDark={lightOrDark}
            />
          </Modal>
        )}

        <View style={styles.footer}></View>
        {modalGoalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalGoalVisible}
            onRequestClose={() => {
              setModalGoalVisible(!modalGoalVisible);
            }}
          >
            <ChooseGoal
              title="Choose Activity"
              showSelectOne={true}
              setModalGoalVisible={setModalGoalVisible}
              setSelectedGoal={setGoal}
              lightOrDark={lightOrDark}
            />
          </Modal>
        )}
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
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
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
});
