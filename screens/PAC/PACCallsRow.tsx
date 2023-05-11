import { Text, View, TouchableOpacity, Linking, Modal, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { styles } from './styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { PACDataProps } from './interfaces';
import PacComplete from './PACCompleteScreen';
import { postponeAction, completeAction } from './postponeAndComplete';
import { mobileTypeMenu, Sheets } from '../Relationships/relationshipHelpers';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import globalStyles from '../../globalStyles';
import { ga4Analytics, handlePhonePressed, handleTextPressed } from '../../utils/general';
import TrackActivity from '../Goals/TrackActivityScreen';
import { getGoalData, trackAction } from '../Goals/api';
import { testForNotificationTrack } from '../Goals/handleWinNotifications';
import { GoalDataProps } from '../Goals/interfaces';
var localGoalID = '0';
var localName = '';
var localID = '';
var localMobile = '';
var localHome = '';
var localOffice = '';

interface PACCallsRowProps {
  key: number;
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
  close(s: Swipeable): void;
}

export default function PACCallsRow(props: PACCallsRowProps) {
  // branch
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [trackActivityVisible, setTrackActivityVisible] = useState(false);
  const [goalList, setGoalList] = useState<GoalDataProps[]>([]);
  const [goalID2, setGoalID2] = useState('1');
  const [goalName2, setGoalName2] = useState('Calls Made');
  const [subject2, setSubject2] = useState('');
  var _swipeableRow: Swipeable;

  async function completePressed() {
    ga4Analytics('PAC_Swipe_Complete', {
      contentType: 'Calls',
      itemId: 'id0416',
    });
    setModalVisible(true);
  }

  function trackActivityComplete( // see "savePressed" in TrackActivityScreen
    guid: string,
    refGUID: string,
    gaveRef: boolean,
    followUp: boolean,
    goalID: string,
    subject: string,
    date: string,
    askedRef: boolean,
    note: string,
    refInPast: boolean
  ) {
    localGoalID = goalID;

    setIsLoading(true);
    trackActivityAPI(
      guid,
      goalID,
      refGUID,
      gaveRef,
      followUp,
      subject,
      date,
      askedRef,
      note,
      refInPast,
      trackSuccess,
      trackFailure
    );
    console.log('saveAppointmentComplete');
  }

  function trackSuccess() {
    setIsLoading(false);
    console.log('track success 1');
    fetchGoals();
  }

  function trackFailure() {
    setIsLoading(false);
    console.log('track failure');
  }

  function fetchGoals() {
    setIsLoading(true);
    getGoalData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setGoalList(res.data);
          console.log('Notes: ' + res.data[1].goal.title);
          console.log('CALLS: ' + res.data[0].goal.title);
          console.log('CALLS: ' + res.data[0].achievedToday);
          notifyIfWin(localGoalID, res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function notifyIfWin(goalId: string, data: GoalDataProps[]) {
    console.log('GOALID: ' + goalId);
    var i = 0;
    while (i < data.length) {
      if (data[i].goal.id.toString() == goalId) {
        testForNotificationTrack(
          data[i].goal.title,
          data[i].goal.weeklyTarget,
          data[i].achievedThisWeek,
          data[i].achievedToday
        );
      }
      i = i + 1;
    }
  }

  function trackActivityAPI(
    contactId: string,
    goalId: string,
    refGUID: string,
    gaveRef: boolean,
    followUP: boolean,
    subject: string,
    date: string,
    referral: boolean,
    note: string,
    refInPast: boolean,
    onSuccess: any,
    onFailure: any
  ) {
    trackAction(contactId, goalId, refGUID, gaveRef, followUP, subject, date, referral, note, refInPast)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
          onFailure();
        } else {
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure();
        console.log('complete error' + error);
      });
  }

  function saveComplete(note: string) {
    console.log('318');
    console.log('Note11 ', note);
    completeAction(props.data.contactId, props.data.type, note, completeSuccess, completeFailure);
  }

  async function postponePressed(contactID: string, type: string) {
    ga4Analytics('PAC_Swipe_Postpone', {
      contentType: 'Calls',
      itemId: 'id0415',
    });
    setIsLoading(true);
    postponeAction(contactID, type, postponeSuccess, postponeFailure);
  }

  function postponeSuccess() {
    console.log('postpone success');
    setIsLoading(false);
    props.refresh();
  }

  function postponeFailure() {
    setIsLoading(false);
    console.log('postpone failure');
  }

  function completeSuccess() {
    setIsLoading(false);
    props.refresh();
  }

  function completeFailure() {
    setIsLoading(false);
    console.log('complete failure');
  }

  function handleMobilePressed() {
    localID = props.data.contactId;
    localName = props.data.contactName;
    localMobile = props.data.mobilePhone;
    console.log('number1: ' + localMobile);
    console.log('name1: ' + localName);
    console.log('id1: ' + localID);
    SheetManager.show(Sheets.mobileSheet);
  }

  function handleHomePressed() {
    localID = props.data.contactId;
    localName = props.data.contactName;
    localHome = props.data.homePhone;
    ga4Analytics('PAC_Home_Call', {
      contentType: 'Calls',
      itemId: 'id0410',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(localHome, () => setTrackActivityVisible(true));
  }

  function handleOfficePressed() {
    localID = props.data.contactId;
    localName = props.data.contactName;
    localOffice = props.data.officePhone;
    ga4Analytics('PAC_Office_Call', {
      contentType: 'Calls',
      itemId: 'id0411',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(localOffice, () => setTrackActivityVisible(true));
  }

  function handleSwipeBegin(rowKey: number) {
    console.log('handle swipe');
    props.close(_swipeableRow);
    props.data.swipeRef = _swipeableRow;
  }

  function handleSwipeEnd() {
    console.log('swipe end');
    props.data.swipeRef = null;
  }

  function updateRef(ref: Swipeable) {
    _swipeableRow = ref;
  }

  const renderRightActions = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <TouchableOpacity
          style={styles.postponeButtonTouch}
          onPress={() => {
            completePressed();
          }}
        >
          <Text style={styles.postponeButton}>Complete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <TouchableOpacity
          style={styles.postponeButtonTouch}
          onPress={() => {
            postponePressed(props.data.contactId, props.data.type);
          }}
        >
          <Text style={styles.postponeButton}>Postpone</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={updateRef}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableWillOpen={() => handleSwipeBegin(props.key)}
      onSwipeableWillClose={handleSwipeEnd}
      friction={2}
    >
      <TouchableOpacity onPress={props.onPress}>
        <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
            {props.data.contactName}
          </Text>
          <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Ranking: ' + props.data.ranking}
          </Text>

          <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Last Call: ' + props.data.lastCallDate}
          </Text>

          {props.data.mobilePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleMobilePressed()}>
              <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobilePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.officePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleOfficePressed()}>
              <Text style={styles.phoneNumber}>{'Office: ' + props.data.officePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.homePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleHomePressed()}>
              <Text style={styles.phoneNumber}>{'Home: ' + props.data.homePhone}</Text>
            </TouchableOpacity>
          )}

          <ActionSheet
            initialOffsetFromBottom={10}
            //   onBeforeShow={(data) => console.log('mobile call type sheet')}
            id={Sheets.mobileSheet}
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
                  {Object.entries(mobileTypeMenu).map(([index, value]) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        SheetManager.hide(Sheets.mobileSheet, null).then(() => {
                          console.log('number: ' + localMobile);
                          console.log('name: ' + localName);
                          console.log('ID: ' + localID);
                          if (value == 'Call') {
                            ga4Analytics('PAC_Mobile_Call', {
                              contentType: 'Calls_Tab',
                              itemId: 'id0408',
                            });
                            setGoalID2('1');
                            setGoalName2('Calls Made');
                            setSubject2('Mobile Call');
                            handlePhonePressed(localMobile, () => setTrackActivityVisible(true));
                          } else {
                            ga4Analytics('PAC_Mobile_Text', {
                              contentType: 'Calls_Tab',
                              itemId: 'id0409',
                            });
                            setGoalID2('7');
                            setGoalName2('Other');
                            setSubject2('Text Message');
                            handleTextPressed(localMobile, () => setTrackActivityVisible(true));
                          }
                        });
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

          {modalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <PacComplete
                contactName={props.data.contactName}
                onSave={saveComplete}
                setModalVisible={setModalVisible}
                type={'calls'}
              />
            </Modal>
          )}
          {trackActivityVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={trackActivityVisible}
              onRequestClose={() => {
                setTrackActivityVisible(!trackActivityVisible);
              }}
            >
              <TrackActivity
                title="Track Activity Goal"
                guid={localID}
                goalID={goalID2}
                goalName={goalName2}
                subjectP={subject2}
                firstName={localName}
                lastName={''}
                onSave={trackActivityComplete}
                setModalVisible={setTrackActivityVisible}
              />
            </Modal>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
