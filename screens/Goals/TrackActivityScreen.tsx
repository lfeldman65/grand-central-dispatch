import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseGoal from '../Goals/ChooseGoalScreen';
import { RolodexDataProps, GoalDataConciseProps } from './interfaces';
const closeButton = require('../../images/button_close_white.png');

export default function TrackActivityScreen(props: any) {
  const { onSave, setModalVisible, trackTitle, lightOrDark } = props;
  const [note, onNoteChange] = useState('');
  const [relationship, setRelationship] = useState<RolodexDataProps>();
  const [referral, setReferral] = useState<RolodexDataProps>();
  const [goal, setGoal] = useState<GoalDataConciseProps>();
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [askedReferral, setAskedReferral] = useState(false);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('TRACKACTIVITY: ' + lightOrDark);
    var initialGoal: GoalDataConciseProps = {
      id: '1',
      title: 'Calls Made',
    };
    setGoal(initialGoal);
  }, [isFocused]);

  function handleRelPressed() {
    setModalRelVisible(!modalRelVisible);
  }

  function handleGoalPressed() {
    setModalGoalVisible(!modalGoalVisible);
  }

  function showDatePicker() {
    setShowDate(true);
  }

  const onDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setDate(currentDate);
  };

  function removeReferralPressed() {}

  function addReferralPressed() {}

  function savePressed() {
    if (relationship?.id == null) {
      Alert.alert('Please Choose a Relationship');
      return;
    }
    setModalVisible(false);
    console.log('GOALID: ' + goal?.id);
    onSave(relationship?.id, goal?.id.toString(), subject, date.toISOString(), askedReferral, note);
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  function isDataValid() {
    if (relationship?.id == null) {
      return false;
    }
    if (subject == null || subject == '') {
      return false;
    }
    return true;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>{trackTitle}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={isDataValid() ? styles.saveButton : styles.saveButtonDim}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.fieldTitle}>Relationship</Text>
      <TouchableOpacity onPress={handleRelPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput editable={false} placeholder="+ Add" placeholderTextColor="#AFB9C2" style={styles.nameLabel}>
              {relationship == null ? '' : relationship.firstName + ' ' + relationship.lastName}
            </TextInput>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.fieldTitle}>Activity Goal</Text>
      <TouchableOpacity onPress={handleGoalPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput editable={false} placeholder="+ Add" placeholderTextColor="#AFB9C2" style={styles.nameLabel}>
              {goal == null ? 'Calls Made' : goal.title}
            </TextInput>
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

      {/* {false && (
        <View style={styles.textAndButtonRow}>
          <Text style={styles.fieldTitle}>{'Who did ' + relationship?.firstName + ' refer?'}</Text>
          <TouchableOpacity style={styles.inlineButtons} onPress={removeReferralPressed}>
            <Text style={styles.inlineButtons}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {false && (
        <TouchableOpacity onPress={addReferralPressed}>
          <View style={styles.textInput}>
            <Text>{referral?.firstName}</Text>
            {(referral == null || referral?.id == '' || referral?.id == null) && (
              <Text style={styles.addText}>+ Add</Text>
            )}
          </View>
        </TouchableOpacity>
      )} */}

      <Text style={styles.fieldTitle}>Date</Text>
      <TouchableOpacity onPress={showDatePicker}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>
              {date.toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                //  hour: 'numeric',
                //  minute: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {showDate && (
        <TouchableOpacity
          onPress={() => {
            setShowDate(false);
          }}
        >
          <Text style={styles.saveButton}>Close</Text>
        </TouchableOpacity>
      )}

      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={onDatePickerChange}
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
        text="I asked for a referral"
        textContainerStyle={{ marginLeft: 10 }}
        style={styles.checkBox}
        onPress={(isChecked: boolean) => {
          console.log(isChecked);
          setAskedReferral(!askedReferral);
        }}
      />

      <Text style={styles.fieldTitle}>Notes</Text>
      <View style={styles.mainContent}>
        <View style={styles.notesView}>
          <TextInput
            style={styles.notesText}
            placeholder="Type Here"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            value={note}
            onChangeText={onNoteChange}
          />
        </View>
      </View>
      {modalRelVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalRelVisible}
          onRequestClose={() => {
            setModalRelVisible(!modalRelVisible);
          }}
        >
          <ChooseRelationship
            title="Choose Relationship"
            setModalRelVisible={setModalRelVisible}
            setSelectedRel={setRelationship}
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
            setModalGoalVisible={setModalGoalVisible}
            setSelectedGoal={setGoal}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}
      <View style={styles.bottom}></View>
    </ScrollView>
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
  textAndButtonRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  addText: {
    fontSize: 16,
    color: '#AFB9C2',
    marginLeft: 20,
    marginBottom: 10,
  },
  inlineButtons: {
    color: '#F99055',
    fontSize: 16,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 5,
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
    opacity: 1.0,
  },
  saveButtonDim: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
    opacity: 0.4,
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
  notesText: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  bottom: {
    height: 600,
  },
});
