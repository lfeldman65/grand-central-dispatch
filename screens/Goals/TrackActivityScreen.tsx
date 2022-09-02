import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ChooseRelationship from '../Goals/ChooseRelationship';
import { RolodexDataProps, RelProps } from './interfaces';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { sub } from 'react-native-reanimated';
const closeButton = require('../../images/button_close_white.png');

export default function TrackActivityScreen(props: any) {
  const { onSave, setModalVisible, trackTitle } = props;
  const [note, onNoteChange] = useState('Some notes 25');
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [relationship, setRelationship] = useState<RolodexDataProps>();
  const [goal, setGoal] = useState('Calls Made');
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [askedReferral, setAskedReferral] = useState(false);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const isFocused = useIsFocused();

  const Sheets = {
    goalSheet: 'filter_sheet_goals',
  };

  const activityGoalMenu = {
    'Calls Made': 'Calls Made',
    'Notes Written': 'Notes Written',
    'Pop-Bys': 'Pop-Bys',
  };

  function handleRelPressed() {
    setModalRelVisible(!modalRelVisible);
  }

  function handleGoalPressed() {
    console.log('activity goal pressed');
    SheetManager.show(Sheets.goalSheet);
  }

  function showDatePicker() {
    setShowDate(true);
  }

  const onDatePickerChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setShowDate(false);
    setDate(currentDate);
  };

  function makeParam(menuItem: string) {
    console.log('A Make param: ' + menuItem);
    if (menuItem == 'Calls Made') {
      return '1';
    }
    if (menuItem == 'Notes Written') {
      return '2';
    }
    if (menuItem == 'Pop-Bys') {
      return '3';
    }
    return '4';
  }

  function savePressed() {
    if (relationship?.id == null) {
      Alert.alert('Please Choose a Relationship');
      return;
    }
    setModalVisible(false);
    var goalId = makeParam(goal);
    onSave(relationship?.id, goalId, subject, date, askedReferral, note);
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
            <Text style={styles.textInput}>{goal}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('recurrence sheet')}
        id={Sheets.goalSheet}
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
              {Object.entries(activityGoalMenu).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    SheetManager.hide(Sheets.goalSheet, null);
                    console.log('goal: ' + value);
                    setGoal(value);
                  }}
                  style={styles.listItemCell}
                >
                  <Text style={styles.listItem}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ActionSheet>

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
        <View style={lightOrDark == 'dark' ? styles.inputViewDark : styles.inputViewLight}>
          <TextInput
            style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
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
          />
        </Modal>
      )}
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
    height: '40%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '40%',
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
    height: 60,
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
