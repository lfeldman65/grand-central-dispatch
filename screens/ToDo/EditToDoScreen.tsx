import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { RolodexDataProps, AttendeesProps } from './interfaces';
import { prettyDate, isNullOrEmpty } from '../../utils/general';
import { editToDo } from './api';
import Attendees from '../ToDo/AttendeesScreen';

const closeButton = require('../../images/button_close_white.png');

export default function EditToDoScreen(props: any) {
  const {
    setModalVisible,
    title,
    todoID,
    titleFromParent,
    dateFromParent,
    priorityFromParent,
    locationFromParent,
    attendeeFromParent,
    notesFromParent,
    onSave,
  } = props;
  const [newTitle, setNewTitle] = useState('');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [showTopDate, setShowTopDate] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [priority, setPriority] = useState('false');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  // const [newAttendees, setNewAttendees] = useState<RolodexDataProps[]>([]);
  const [attendee, setAttendees] = useState<RolodexDataProps[]>([]);

  const showDateTopPicker = () => {
    console.log('show date picker top');
    showDateTopMode('date');
  };

  const onDatePickerTopChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShowTopDate(false);
    setNewDate(currentDate);
  };

  const showDateTopMode = (currentMode: any) => {
    console.log(currentMode);
    setShowTopDate(true);
  };

  useEffect(() => {
    getDarkOrLightMode();
    setNewTitle(titleFromParent);
    setNewLocation(locationFromParent);
    setNewNotes(notesFromParent);
    setPriority(priorityFromParent);
    console.log('priority1: ' + priorityFromParent);
  }, [isFocused]);

  function cancelPressed() {
    setModalVisible(false);
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

  function savePressed() {
    console.log('toDoID: ' + todoID);
    console.log('attendeeFromParent: ' + attendeeFromParent);
    editToDo(todoID, newTitle, dateFromParent, priority, newLocation, newNotes, attendeeFromParent)
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

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
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
      <Text style={styles.nameTitle}>Date</Text>
      <TouchableOpacity onPress={showDateTopPicker}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{prettyDate(dateFromParent)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {showTopDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newDate}
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
        isChecked={priorityFromParent == 'True' ? true : false}
        onPress={(isChecked: boolean) => {
          setPriority(isChecked ? 'True' : 'False');
        }}
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

      <Text style={styles.nameTitle}>Attendees</Text>

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
    </ScrollView>
  );
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    alignItems: 'center',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
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
  checkBox: {
    marginTop: 12,
    left: 20,
    marginBottom: 25,
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
