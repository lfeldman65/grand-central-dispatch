import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { RolodexDataProps } from './interfaces';
import { editToDo } from './api';
import Attendees from '../ToDo/AttendeesScreen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { GoalDataConciseProps } from '../Goals/interfaces';
import ChooseGoal from '../Goals/ChooseGoalScreen';
import globalStyles from '../../globalStyles';

const closeButton = require('../../images/button_close_white.png');

export default function EditToDoScreen(props: any) {
  const {
    setModalVisible,
    activityTypeId,
    activityTypeTitle,
    todoID,
    titleFromParent,
    dateFromParent,
    priorityFromParent,
    locationFromParent,
    attendeeFromParent,
    notesFromParent,
    onSave,
    lightOrDark,
  } = props;
  const [newTitle, setNewTitle] = useState('');
  const [goal, setGoal] = useState<GoalDataConciseProps>();
  const isFocused = useIsFocused();
  const [showTopDate, setShowTopDate] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [priority, setPriority] = useState('false');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [modalAttendeesVisible, setModalAttendeesVisible] = useState(false);
  const [attendee, setAttendees] = useState<RolodexDataProps[]>([]);
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  const notesInputRef = useRef<TextInput>(null);

  const handleConfirm = (selectedDate: any) => {
    const currentDate = selectedDate;
    //todo dates don't need time information, we will set time to 0:00 for local timezone
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);
    setNewDate(currentDate);
    setShowTopDate(false);
  };

  const showDateTopMode = (currentMode: any) => {
    console.log(currentMode);
    setShowTopDate(true);
  };

  function hideDatePicker() {
    setShowTopDate(false);
  }

  useEffect(() => {
    setNewTitle(titleFromParent);
    setNewLocation(locationFromParent);
    setNewNotes(notesFromParent);
    setPriority(priorityFromParent);
    setNewDate(new Date(Date.parse(dateFromParent)));
    var initialGoal: GoalDataConciseProps = {
      id: activityTypeId,
      title: activityTypeTitle,
    };
    setGoal(initialGoal);
  }, [isFocused]);

  function cancelPressed() {
    setModalVisible(false);
  }

  function handleAttendeesPressed() {
    console.log('handle attendee pressed');
    setModalAttendeesVisible(!modalAttendeesVisible);
  }

  function handleGoalPressed() {
    setModalGoalVisible(!modalGoalVisible);
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

  function deleteAttendee(index: number) {
    console.log(index);
    attendeeFromParent.splice(index, 1);
    const newAttendees = [...attendeeFromParent, ...[]];
    //  console.log(newAttendees.length);
    setAttendees(newAttendees);
  }

  function savePressed() {
    console.log('toDoID: ' + todoID);
    console.log('attendeeFromParent: ' + attendeeFromParent);
    editToDo(todoID, newTitle, goal?.id!, newDate.toISOString(), priority, newLocation, newNotes, attendeeFromParent)
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

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={styles.nameLabel}>{titleFromParent}</Text>
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
              {goal?.id == 0 ? 'Select One (Optional)' : goal?.title}
            </TextInput>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.nameTitle}>Date</Text>
      <TouchableOpacity onPress={showDateTopMode}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>
              {newDate.toLocaleDateString('en-us', {
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
        date={newDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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
            title="Attendees"
            setModalAttendeesVisible={setModalAttendeesVisible}
            setSelectedAttendees={handleSelectedAttendees}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}
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
            title="Choose Goal"
            showSelectOne={true}
            setModalGoalVisible={setModalGoalVisible}
            setSelectedGoal={setGoal}
            lightOrDark={lightOrDark}
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
  footer: {
    // Can't scroll to bottom of Notes without this
    height: 500,
  },
});
