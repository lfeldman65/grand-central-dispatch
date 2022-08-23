import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { RolodexDataProps, RelProps } from './interfaces';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
const closeButton = require('../../images/button_close_white.png');

export default function TrackActivityScreen(props: any) {
  const { onSave, setModalVisible, trackTitle } = props;
  const [note, onNoteChange] = useState('Some notes 25');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [relName, setRelName] = useState<RolodexDataProps[]>([]);
  const [goal, setGoal] = useState('Calls Made');
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [askedReferral, setAskedReferral] = useState(false);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const isFocused = useIsFocused();

  var newAttendees = new Array();
  relName.forEach((item, index) => {
    var attendeeProps: RelProps = {
      id: item.id,
      name: item.firstName,
    };
    newAttendees.push(attendeeProps);
  });

  function handleRelPressed() {
    setModalRelVisible(!modalRelVisible);
  }

  function handleGoalPressed() {
    console.log('activity goal pressed');
  }

  function makeParam(menuItem: string) {
    console.log('A Make param: ' + menuItem);
    if (menuItem == 'Calls Made') {
      return 'call';
    }
    if (menuItem == 'Notes Written') {
      return 'notes';
    }
    if (menuItem == 'Pop-Bys') {
      return 'popby';
    }
    return 'other';
  }

  function savePressed() {
    setModalVisible(false);
    console.log('A: goal ' + goal);
    var param = makeParam(goal);
    console.log('A: param: ' + param);
    onSave(note, param);
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>{trackTitle}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.fieldTitle}>Relationship</Text>
      {relName.length > 0 &&
        relName.map((item, index) => (
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput} onPress={handleRelPressed}>
                {item.firstName}
              </Text>
            </View>
          </View>
        ))}

      {relName.length == 0 && (
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput} onPress={handleRelPressed}>
              + Add
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.fieldTitle}>Activity Goal</Text>
      <TouchableOpacity onPress={handleGoalPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{goal}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.fieldTitle}>Subject</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setSubject(text)}
            defaultValue={subject}
          />
        </View>
      </View>
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
  addRel: {
    fontSize: 18,
    color: 'silver',
    width: 300,
  },
  checkBox: {
    marginTop: 12,
    left: 20,
    marginBottom: 25,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
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
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
    marginTop: 5,
  },
  fieldTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
  },
  pageTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  notesText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
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
  filterView: {
    width: '100%',
    padding: 12,
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
});
