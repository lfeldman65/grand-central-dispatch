import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { RolodexDataProps } from '../Relationships/interfaces';
import { editAppointment } from './api';
import Attendees from '../ToDo/AttendeesScreen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { apptStartDateLabel, apptStartTimeLabel, apptEndDateLabel, apptEndTimeLabel } from './calendarHelpers';
import globalStyles from '../../globalStyles';
const closeButton = require('../../images/button_close_white.png');

export default function EditAppointmentScreen(props: any) {
  const {
    setModalVisible,
    title,
    apptID,
    titleFromParent,
    startDateFromParent,
    toDateFromParent,
    locationFromParent,
    attendeeFromParent,
    notesFromParent,
    onSave,
  } = props;
  const [newTitle, setNewTitle] = useState('');

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const [attendee, setAttendees] = useState<RolodexDataProps[]>([]);
  const isFocused = useIsFocused();
  const notesInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setNewTitle(titleFromParent);
    setNewLocation(locationFromParent);
    setNewNotes(notesFromParent);
    setStartDate(new Date(Date.parse(startDateFromParent)));
    setEndDate(new Date(Date.parse(toDateFromParent)));
  }, [isFocused]);

  function CancelPressed() {
    setModalVisible(false);
  }

  function savePressed() {
    console.log('apptID: ' + apptID);
    editAppointment(
      apptID,
      newTitle,
      startDate.toISOString(),
      endDate.toISOString(),
      newLocation,
      newNotes,
      attendeeFromParent
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          // console.log('here 2' + res);
          setModalVisible(false);
          onSave();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

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

  function deleteAttendee(index: number) {
    console.log(index);
    attendeeFromParent.splice(index, 1);
    const newAttendees = [...attendeeFromParent, ...[]];
    //  console.log(newAttendees.length);
    setAttendees(newAttendees);
  }

  function handleAttendeesPressed() {
    console.log('handle attendee pressed');
    setModalAttendeesVisible(!modalAttendeesVisible);
  }

  function handleSelectedAttendees(selected: RolodexDataProps[]) {
    selected.forEach((item, index) => {
      attendeeFromParent.push({ name: item.firstName, id: item.id });
    });

    console.log('attendeeFromParent:' + attendeeFromParent[0].id);

    var toBeRemoved = new Array();

    attendeeFromParent.forEach((item: any, index: number) => {
      // remove duplicates
      console.log('in loop');
      console.log(attendeeFromParent);
      attendeeFromParent.forEach((item2: any, index2: number) => {
        console.log('in 2nd loop');
        console.log('item id: ' + item.id);
        console.log('item2 id: ' + item2.id);
        if (item.id == item2.id && index != index2) attendeeFromParent.splice(index2, 1);
      });
    });

    console.log('to be added: ' + toBeRemoved.length);

    console.log('attendee from parent: ' + attendeeFromParent);
    setAttendees(attendeeFromParent);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Text style={globalStyles.cancelButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.nameLabel}>{title}</Text>
        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.nameTitle}>Title</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setNewTitle(text)}
            defaultValue={titleFromParent}
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

      <Text style={styles.nameTitle}>Location</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setNewLocation(text)}
            defaultValue={locationFromParent}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Relationships</Text>
      {attendeeFromParent?.map((item: any, index: number) => (
        <View style={styles.mainContent}>
          <View style={styles.attendeeView}>
            <Text style={styles.attendeeInput}>{item.name}</Text>
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
            value={newNotes}
            onChangeText={(text) => setNewNotes(text)}
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
  );
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
  },
  mainContent: {
    alignItems: 'center',
  },
  footer: {
    // Can't scroll to bottom of Notes without this
    height: 500,
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
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
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
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
    color: 'white',
    marginTop: 10,
    marginLeft: 10,
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
});
