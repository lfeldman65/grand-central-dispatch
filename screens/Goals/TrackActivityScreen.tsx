import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseGoal from '../Goals/ChooseGoalScreen';
import { RolodexDataProps, GoalDataConciseProps } from './interfaces';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import globalStyles from '../../globalStyles';
import { ga4Analytics } from '../../utils/general';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const refMenuChoice1 = 'Client gave me referral';
const refMenuChoice2 = 'Client was referred to me';
const refMenuChoice3 = 'I gave client a referral';

export default function TrackActivityScreen(props: any) {
  const { setModalVisible, title, onSave, guid, firstName, lastName, goalID, goalName, subjectP, lightOrDark } = props;
  const [notes, setNotes] = useState('');
  const [relationship, setRelationship] = useState<RolodexDataProps>();
  const [referral, setReferral] = useState<RolodexDataProps>();
  const [goal, setGoal] = useState<GoalDataConciseProps>();
  const [refType, setRefType] = useState('1');
  const [date, setDate] = useState(new Date());
  const [showStartTime, setShowStartTime] = useState(false);
  const [subject, setSubject] = useState(subjectP);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  const [modalRefVisible, setModalRefVisible] = useState(false);
  const [refInPast, setRefInPast] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const isFocused = useIsFocused();
  const notesInputRef = useRef<TextInput>(null);

  const filters = {
    'Client gave me referral': 'Client gave me referral',
    'Client was referred to me': 'Client was referred to me',
    'I gave client a referral': 'I gave client a referral',
  };

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  const handleConfirm = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setDate(currentDate);
    setShowDate(false);
  };

  function handleNotesFocus() {
    if (notesInputRef != null && notesInputRef.current != null) {
      notesInputRef.current.focus();
    }
  }

  function hideDatePicker() {
    setShowDate(false);
  }

  function convertToText(refType: string) {
    console.log('rel: ' + relationship?.firstName);
    console.log('ref: ' + referral?.firstName);
    var newRel = relationship?.firstName ?? 'Client';
    var newRef = referral?.firstName ?? '';

    if (refType == '1') {
      return newRel + ' gave me a referral ';
    }
    if (refType == '2') {
      return newRel + ' was referred to me';
    }
    if (refType == '3') {
      return 'I gave ' + relationship?.firstName + ' a referral';
    }
  }

  function convertToString(filterItem: string) {
    console.log(filterItem);
    if (filterItem == refMenuChoice1) {
      return '1';
    }
    if (filterItem == refMenuChoice2) {
      return '2';
    }
    if (filterItem == refMenuChoice3) {
      return '3';
    }
    return '4';
  }

  useEffect(() => {
    var initialGoal: GoalDataConciseProps = {
      id: goalID ?? 1,
      title: goalName ?? 'Call Made',
    };
    setGoal(initialGoal);
    console.log('track firstname: ' + firstName);
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
      setRelationship(rel);
    }
  }, [isFocused]);

  function handleRelPressed() {
    setModalRelVisible(!modalRelVisible);
  }

  function addReferralPressed() {
    setModalRefVisible(!modalRefVisible);
  }

  function referralTypePressed() {
    SheetManager.show(Sheets.filterSheet);
  }

  function handleGoalPressed() {
    setModalGoalVisible(!modalGoalVisible);
  }

  function showDatePicker() {
    setShowDate(true);
  }

  const showStartTimeMode = (currentMode: any) => {
    console.log(currentMode);
    setShowStartTime(true);
  };

  const handleConfirmStartTime = (selectedDate: any) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setDate(currentDate);
    setShowStartTime(false);
  };

  function hideStartTimePicker() {
    setShowStartTime(false);
  }

  function savePressed() {
    ga4Analytics('Goals_Track_Save', {
      contentType: 'none',
      itemId: 'id0308',
    });
    if (relationship?.id == null) {
      Alert.alert('Please choose a Relationship');
      return;
    }
    if (!goal?.title.includes('Referral') && (subject == null || subject == '')) {
      Alert.alert('Please enter a Subject');
      return;
    }
    if (goal?.title.includes('Referral') && referral == null) {
      Alert.alert('Please choose a Referral');
      return;
    }
    setModalVisible(false);
    console.log('GOALID: ' + goal?.id);
    onSave(
      relationship?.id,
      referral?.id,
      refType == '3',
      refType != '3',
      goal?.id.toString(),
      subject,
      date.toISOString(),
      true, // asked for referral deprecated, but set to true just in case
      notes,
      refInPast
    );
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  function isDataValid() {
    if (relationship?.id == null) {
      return false;
    }
    if (!goal?.title.includes('Referral') && (subject == null || subject == '')) {
      return false;
    }
    if (goal?.title.includes('Referral') && referral == null) {
      return false;
    }
    return true;
  }

  function formatTitle(ugly: string) {
    if (goal == null) {
      return 'Call Made';
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>{title}</Text>
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

      <Text style={styles.fieldTitle}>Activity</Text>
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
              {formatTitle(goal?.title!)}
            </TextInput>
          </View>
        </View>
      </TouchableOpacity>

      {goal?.title.includes('Referral') && <Text style={styles.fieldTitle}>Referral Type</Text>}
      {goal?.title.includes('Referral') && (
        <TouchableOpacity onPress={referralTypePressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <TextInput editable={false} placeholder="+ Add" placeholderTextColor="#AFB9C2" style={styles.nameLabel}>
                {convertToText(refType)}
              </TextInput>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {goal?.title.includes('Referral') && (
        <Text style={styles.fieldTitle}>{refType == '2' ? 'Referrer:' : 'Referral:'}</Text>
      )}
      {goal?.title.includes('Referral') && (
        <TouchableOpacity onPress={addReferralPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <TextInput editable={false} placeholder="+ Add" placeholderTextColor="#AFB9C2" style={styles.nameLabel}>
                {referral == null ? '' : referral.firstName + ' ' + referral.lastName}
              </TextInput>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {modalRefVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalRefVisible}
          onRequestClose={() => {
            setModalRefVisible(!modalRefVisible);
          }}
        >
          <ChooseRelationship
            title="Choose Relationship"
            setModalRelVisible={setModalRefVisible}
            setSelectedRel={setReferral}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      {!goal?.title.includes('Referral') && <Text style={styles.fieldTitle}>Subject</Text>}
      {!goal?.title.includes('Referral') && (
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
      )}

      {goal?.title.includes('Referral') && (
        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="This referral occured in the past"
          textContainerStyle={{ marginLeft: 10 }}
          style={styles.checkBox}
          onPress={(isChecked: boolean) => {
            console.log(isChecked);
            setRefInPast(!refInPast);
          }}
        />
      )}

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
      <DateTimePickerModal isVisible={showDate} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />

      <Text style={styles.fieldTitle}>Time</Text>
      <TouchableOpacity onPress={showStartTimeMode}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>
              {date.toLocaleTimeString('en-us', {
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
        date={date}
        mode="time"
        onConfirm={handleConfirmStartTime}
        onCancel={hideStartTimePicker}
      />

      <Text style={styles.fieldTitle}>Notes</Text>
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
      <ActionSheet
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('action sheet')}
        id={Sheets.filterSheet}
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
            style={styles.scrollview}
          >
            <View>
              {Object.entries(filters).map(([index, value]) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    SheetManager.hide(Sheets.filterSheet, null);
                    setRefType(convertToString(value));
                    // fetchData();
                  }}
                  style={globalStyles.listItemCell}
                >
                  <Text style={globalStyles.listItem}>{index}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ActionSheet>
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
            setModalGoalVisible={setModalGoalVisible}
            setSelectedGoal={setGoal}
            showSelectOne={false}
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
  scrollview: {
    width: '100%',
    padding: 12,
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
    marginTop: 50,
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
  cancelButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    paddingLeft: '3%',
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
