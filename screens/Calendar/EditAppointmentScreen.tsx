import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { RolodexDataProps } from '../Relationships/interfaces';
import DateTimePicker from '@react-native-community/datetimepicker';
import { editAppointment } from './api';
import Attendees from '../ToDo/AttendeesScreen';
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
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [showFromDate, setShowFromDate] = useState(false);
  const [newFromDate, setNewFromDate] = useState(new Date());
  const [showToDate, setShowToDate] = useState(false);
  const [newToDate, setNewToDate] = useState(new Date());
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const [attendee, setAttendees] = useState<RolodexDataProps[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    setNewTitle(titleFromParent);
    setNewLocation(locationFromParent);
    setNewNotes(notesFromParent);
    setNewFromDate(new Date(Date.parse(startDateFromParent)));
    setNewToDate(new Date(Date.parse(toDateFromParent)));
  }, [isFocused]);

  function CancelPressed() {
    setModalVisible(false);
  }

  function savePressed() {
    console.log('apptID: ' + apptID);
    editAppointment(
      apptID,
      newTitle,
      newFromDate.toISOString(),
      newToDate.toISOString(),
      newLocation,
      newNotes,
      attendeeFromParent
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
      })
      .catch((error) => console.error('failure ' + error));
  }

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const showFromDatePicker = () => {
    showDateFromMode('time');
  };

  const onDatePickerFromChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    //  setShowFromDate(false);
    setNewFromDate(currentDate);
  };

  const showDateFromMode = (currentMode: any) => {
    console.log(currentMode);
    setShowFromDate(true);
  };

  const showToDatePicker = () => {
    showDateToMode('date');
  };

  const showDateToMode = (currentMode: any) => {
    console.log(currentMode);
    setShowToDate(true);
  };

  const onDatePickerToChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    //   setShowToDate(false);
    setNewToDate(currentDate);
  };

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
          <Image source={closeButton} style={styles.closeX} />
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
      <Text style={styles.nameTitle}>From</Text>
      <TouchableOpacity onPress={showFromDatePicker}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>
              {newFromDate.toLocaleDateString('en-us', {
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
          value={newFromDate}
          mode={'date'}
          is24Hour={true}
          onChange={onDatePickerFromChange}
          display="spinner"
          textColor="white"
        />
      )}
      <Text style={styles.nameTitle}>To</Text>
      <TouchableOpacity onPress={showToDatePicker}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>
              {newToDate.toLocaleDateString('en-us', {
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
          value={newToDate}
          mode={'date'}
          is24Hour={true}
          onChange={onDatePickerToChange}
          display="spinner"
          textColor="white"
        />
      )}

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

      <Text style={styles.nameTitle}>Attendees</Text>
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
        <View style={lightOrDark == 'dark' ? styles.notesViewDark : styles.notesViewLight}>
          <TextInput
            style={lightOrDark == 'dark' ? styles.notesTextDark : styles.notesTextLight}
            placeholder="Type Here"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            value={newNotes}
            onChangeText={(text) => setNewNotes(text)}
            defaultValue={notesFromParent}
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
          <Attendees
            title="Attendees"
            setModalAttendeesVisible={setModalAttendeesVisible}
            setSelectedAttendees={handleSelectedAttendees}
          />
        </Modal>
      )}
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
    marginTop: 30,
  },
  mainContent: {
    alignItems: 'center',
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
  notesViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '70%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  notesViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '70%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  notesTextDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  notesTextLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
