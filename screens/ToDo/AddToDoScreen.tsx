import { useState, useEffect } from 'react';
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
} from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useIsFocused } from '@react-navigation/native';
import { addNewToDo } from './api';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';

//import { RolodexDataProps } from './interfaces';

let deviceWidth = Dimensions.get('window').width;

export default function AddToDoScreen(props: any) {
  const { setModalVisible, title, onSave } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [toDoTitle, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState(false);
  const [recurrence, setRecurrence] = useState('Never');
  const [untilType, setUntilType] = useState('Times');
  const [untilTimes, setUntilTimes] = useState('');
  const [reminder, setReminder] = useState('None');
  const [howRemind, setHowRemind] = useState('Text');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function SavePressed() {
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

    addNewToDo(toDoTitle, date.toISOString(), priority, location, recurrence, notes)
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

  function CancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={SavePressed}>
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
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              //   onChangeText={(text) => setDate(text)}
              defaultValue={date.toDateString()}
            />
          </View>
        </View>

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
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setRecurrence(text)}
              defaultValue={recurrence}
            />
          </View>
        </View>

        {recurrence != 'Never' && (
          <View style={styles.recurrenceRow}>
            <View style={styles.untilView}>
              <TextInput
                style={styles.textInput}
                placeholder="+ Add"
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                onChangeText={(text) => setUntilType(text)}
                defaultValue={untilType}
              />
            </View>

            <View style={styles.untilView}>
              <TextInput
                style={styles.textInput}
                placeholder="+ Add"
                placeholderTextColor="#AFB9C2"
                textAlign="left"
                onChangeText={(text) => setUntilType(text)}
                defaultValue={untilTimes}
              />
            </View>
          </View>
        )}

        <Text style={styles.nameTitle}>Reminder</Text>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setReminder(text)}
              defaultValue={reminder}
            />
          </View>
        </View>

        {reminder != 'None' && (
          <View style={{ flexDirection: 'row', marginLeft: 0 }}>
            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              //   isChecked={reminderText}
              unfillColor="#004F89"
              iconStyle={{ borderColor: 'white' }}
              text="Text"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              onPress={(isChecked: boolean) => {
                console.log(isChecked);
                if (!isChecked) {
                  setHowRemind('Email');
                }
              }}
            />

            <Text style={{ width: 20 }}></Text>

            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              unfillColor="#004F89"
              iconStyle={{ borderColor: 'white' }}
              text="Email"
              textContainerStyle={{ marginLeft: 10 }}
              style={styles.checkBox}
              onPress={(isChecked: boolean) => {
                console.log(isChecked);
                setHowRemind('Text');
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
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              //   onChangeText={(text) => setFirstName(text)}
              //   defaultValue={firstName}
            />
          </View>
        </View>

        <Text style={styles.nameTitle}>Notes</Text>
        <View style={styles.mainContent}>
          <View style={lightOrDark == 'dark' ? styles.notesViewDark : styles.notesViewLight}>
            <TextInput
              style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
              placeholder="Type Here"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              //   value={note}
              //   onChangeText={onNoteChange}
            />
          </View>
        </View>

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
  recurrenceRow: {
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
    width: 0.9 * deviceWidth,
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
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  checkBox: {
    marginTop: 12,
    left: 0.055 * deviceWidth,
    marginBottom: 25,
  },
  notesViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  notesViewLight: {
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
