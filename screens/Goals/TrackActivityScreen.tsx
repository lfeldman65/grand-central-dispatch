import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseGoal from '../Goals/ChooseGoalScreen';
import { RolodexDataProps, GoalDataConciseProps } from './interfaces';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import globalStyles from '../../globalStyles';
import { ga4Analytics } from '../../utils/general';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const closeButton = require('../../images/button_close_white.png');

export default function TrackActivityScreen(props: any) {
  const { setModalVisible, title, onSave, guid, firstName, lastName, goalID, goalName, subjectP, lightOrDark } = props;
  const [note, onNoteChange] = useState('');
  const [relationship, setRelationship] = useState<RolodexDataProps>();
  const [referral, setReferral] = useState<RolodexDataProps>();
  const [goal, setGoal] = useState<GoalDataConciseProps>();
  const [refType, setRefType] = useState('1');
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState(subjectP);
  const [askedReferral, setAskedReferral] = useState(true);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  const [modalRefVisible, setModalRefVisible] = useState(false);
  const [refInPast, setRefInPast] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const isFocused = useIsFocused();

  const filters = {
    'Relationship gave me referral Referral': 'Relationship gave me referral Referral',
    'Relationship was referred to me by Referrer': 'Relationship was referred to me by Referrer',
    'I gave Relationship referral Referral': 'I gave Relationship referral Referral',
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

  function hideDatePicker() {
    setShowDate(false);
  }

  function convertToText(refType: string) {
    if (refType == '1') {
      return relationship?.firstName + ' referred ' + referral?.firstName;
    }
    if (refType == '2') {
      return 'Relationship was referred to me by Referrer';
    }
    if (refType == '3') {
      return 'I gave Relationship referral Referral';
    }
  }

  function convertToString(filterItem: string) {
    if (filterItem == 'Relationship gave me referral Referral') {
      return '1';
    }
    if (filterItem == 'Relationship was referred to me by Referrer') {
      return '2';
    }
    if (filterItem == 'I gave Relationship referral Referral') {
      return '3';
    }
    return '4';
  }

  useEffect(() => {
    var initialGoal: GoalDataConciseProps = {
      id: goalID ?? 1,
      title: goalName ?? 'Calls Made',
    };
    setGoal(initialGoal);
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

  function savePressed() {
    ga4Analytics('Goals_Track_Save', {
      contentType: 'none',
      itemId: 'id0308',
    });
    if (relationship?.id == null) {
      Alert.alert('Please Choose a Relationship');
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
      askedReferral,
      note,
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
    return true;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
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

      {showDate && (
        <TouchableOpacity
          onPress={() => {
            setShowDate(false);
          }}
        >
          <Text style={styles.saveButton}>Close</Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal isVisible={showDate} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />

      <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
        size={25}
        textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
        fillColor="#37C0FF"
        unfillColor="#004F89"
        iconStyle={{ borderColor: 'white' }}
        text="I asked for a referral"
        isChecked={askedReferral}
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

            {/*  Add a Small Footer at Bottom */}
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
