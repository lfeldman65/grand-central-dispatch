import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import PacComplete from './PACCompleteScreen';
import { getPACDetails } from './api';
import openMap from 'react-native-open-maps';
import { styles } from './styles';
import { isNullOrEmpty, ga4Analytics, handlePhonePressed, handleTextPressed } from '../../utils/general';
import { AddressProps, ContactDetailDataProps } from './interfaces';
import { completeAction, postponeAction } from './postponeAndComplete';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { mobileTypeMenu, relSheets } from '../Relationships/relationshipHelpers';
import globalStyles from '../../globalStyles';
import TrackActivity from '../Goals/TrackActivityScreen';
import { getGoalData, trackAction } from '../Goals/api';
import { testForNotificationTrack } from '../Goals/handleWinNotifications';
let deviceHeight = Dimensions.get('window').height;
import { GoalDataProps } from '../Goals/interfaces';
var localGoalID = '0';

export default function PACDetailScreen(props: any) {
  const { route } = props;
  const { contactId, type, ranking, lastCallDate, lastNoteDate, lastPopByDate, lightOrDark } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState<ContactDetailDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const [trackActivityVisible, setTrackActivityVisible] = useState(false);
  const [goalList, setGoalList] = useState<GoalDataProps[]>([]);
  const [goalID2, setGoalID2] = useState('1');
  const [goalName2, setGoalName2] = useState('Calls Made');
  const [subject2, setSubject2] = useState('');

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

  function postponePressed() {
    ga4Analytics('PAC_Details_Postpone', {
      contentType: 'none',
      itemId: 'id0419',
    });
    postponeEvent(contactId, type);
  }

  function handleMobilePressed() {
    console.log('mobile pressed here');
    SheetManager.show(relSheets.mobileSheet);
  }

  function handleHomePressed() {
    console.log('Home pressed');
    ga4Analytics('PAC_Home_Call', {
      contentType: 'Details',
      itemId: 'id0410',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(data?.homePhone!, () => setTrackActivityVisible(true));
    // Linking.openURL(`tel:${data!.homePhone}`);
  }

  function handleOfficePressed() {
    ga4Analytics('PAC_Office_Call', {
      contentType: 'Details',
      itemId: 'id0411',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(data?.officePhone!, () => setTrackActivityVisible(true));
  }

  // function handlePhonePressed(type: string) {
  //   if (type == 'mobile') {
  //     Linking.openURL(`tel:${data?.mobile}`);
  //   } else if (type == 'office') {
  //     Linking.openURL(`tel:${data?.officePhone}`);
  //   } else {
  //     Linking.openURL(`tel:${data?.homePhone}`);
  //   }
  // }

  function goToRelDetails() {
    console.log('PAC: ' + data?.id);
    ga4Analytics('PAC_Details_Relationship', {
      contentType: 'none',
      itemId: 'id0417',
    });
    navigation.navigate('RelDetails', {
      contactId: data?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      rankFromAbove: data?.ranking,
      lightOrDark: lightOrDark,
    });
  }

  function lastDate() {
    if (type == 'call') {
      return 'Last Call: ' + lastCallDate;
    }
    if (type == 'notes') {
      return 'Last Note Sent: ' + lastNoteDate;
    }
    if (type == 'popby') {
      return 'Last Pop-By: ' + lastPopByDate;
    }
  }

  async function completePressed() {
    ga4Analytics('PAC_Details_Complete', {
      contentType: 'none',
      itemId: 'id0418',
    });

    setModalVisible(true);
  }

  function saveComplete(note: string) {
    completeEvent(contactId, type, note);
  }

  function handleDirectionsPressed(address?: AddressProps) {
    ga4Analytics('PAC_Directions', {
      contentType: 'Details',
      itemId: 'id0412',
    });
    openMap({ query: completeAddress(address) });
  }

  function formatCityStateZip(address?: AddressProps) {
    var cityStateZip = '';
    if (!isNullOrEmpty(address?.city)) {
      cityStateZip = address?.city!;
    }
    if (!isNullOrEmpty(address?.state)) {
      cityStateZip = cityStateZip + ', ' + address?.state;
    }
    if (!isNullOrEmpty(address?.zip)) {
      cityStateZip = cityStateZip + ' ' + address?.zip;
    }
    return cityStateZip;
  }

  function completeAddress(address?: AddressProps) {
    var completeAddress = '';
    if (!isNullOrEmpty(address?.street)) {
      completeAddress = address?.street!;
    }
    if (!isNullOrEmpty(address?.street2)) {
      completeAddress = completeAddress + ' ' + address?.street2!;
    }
    return completeAddress + formatCityStateZip(address);
  }

  function contactName() {
    if (data?.firstName == null) {
      return '';
    }
    if (data?.lastName == null) {
      return '';
    }
    return data?.firstName + ' ' + data?.lastName;
  }

  function completeEvent(contactId: string, type: string, note: string) {
    setIsLoading(true);
    completeAction(contactId, type, note, completeSuccess, completeFailure);
  }

  function postponeEvent(contactId: string, type: string) {
    setIsLoading(true);
    postponeAction(contactId, type, postponeSuccess, postponeFailure);
  }

  function postponeSuccess() {
    setIsLoading(false);
    navigation.goBack();
  }

  function postponeFailure() {
    setIsLoading(false);
    console.log('postpone failure');
  }

  function completeSuccess() {
    setIsLoading(false);
    navigation.goBack();
  }

  function completeFailure() {
    setIsLoading(false);
    console.log('complete failure');
  }

  function fetchPacDetailData(id: string) {
    setIsLoading(true);
    getPACDetails(id)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          //   console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  //put it in a useEffect to prevent the warning about rendering a different component blah blah
  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: contactName() });
  }); // this will run on every rendeer
  useEffect(() => {
    fetchPacDetailData(contactId);
  }, []);

  if (isLoading) {
    return (
      <View style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}>
        <ActivityIndicator size="large" color="#AAA" />
      </View>
    );
  }

  return (
    <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
      <View style={lightOrDark == 'dark' ? stylesDetail.topContainerDark : stylesDetail.topContainerLight}>
        <TouchableOpacity
          onPress={() => {
            goToRelDetails();
          }}
        >
          <Text style={stylesDetail.personName}>{contactName()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleMobilePressed();
          }}
        >
          {!isNullOrEmpty(data?.mobile) && <Text style={stylesDetail.sectionTitle}>{'Mobile Phone'}</Text>}
          {!isNullOrEmpty(data?.mobile) && <Text style={stylesDetail.phoneNumber}>{data?.mobile}</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleOfficePressed();
          }}
        >
          {!isNullOrEmpty(data?.officePhone) && <Text style={stylesDetail.sectionTitle}>{'Office Phone'}</Text>}
          {!isNullOrEmpty(data?.officePhone) && <Text style={stylesDetail.phoneNumber}>{data?.officePhone}</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleHomePressed();
          }}
        >
          {!isNullOrEmpty(data?.homePhone) && <Text style={stylesDetail.sectionTitle}>{'Home Phone'}</Text>}
          {!isNullOrEmpty(data?.homePhone) && <Text style={stylesDetail.phoneNumber}>{data?.homePhone}</Text>}
        </TouchableOpacity>

        <View style={styles.popbyRow}>
          {!isNullOrEmpty(data?.address.street) && <Text style={stylesDetail.sectionTitle}>Location</Text>}
          {!isNullOrEmpty(data?.address.street) && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed(data?.address)}>
              <Text style={styles.popByButtons}>{'Directions'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isNullOrEmpty(data?.address.street) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
            {data?.address.street}
          </Text>
        )}
        {!isNullOrEmpty(data?.address.street2) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
            {data?.address.street2}
          </Text>
        )}
        {!isNullOrEmpty(data?.address) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.cityStateZipTextDark : stylesDetail.cityStateZipTextLight}>
            {formatCityStateZip(data?.address)}
          </Text>
        )}

        <Text style={stylesDetail.sectionTitle}>Notes</Text>
        <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
          {'Ranking: ' + ranking}
        </Text>
        <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
          {lastDate()}
        </Text>
      </View>

      <View style={lightOrDark == 'dark' ? stylesDetail.bottomContainerDark : stylesDetail.bottomContainerLight}>
        <TouchableOpacity onPress={completePressed}>
          <Text style={stylesDetail.completeText}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={postponePressed}>
          <Text style={stylesDetail.postponeText}>Postpone</Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('mobile call type sheet')}
        id={relSheets.mobileSheet}
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
                    SheetManager.hide(relSheets.mobileSheet, null).then(() => {
                      console.log('value: ' + value);
                      if (value == 'Call') {
                        ga4Analytics('PAC_Mobile_Call', {
                          contentType: 'Details',
                          itemId: 'id0408',
                        });
                        setGoalID2('1');
                        setGoalName2('Calls Made');
                        setSubject2('Mobile Call');
                        handlePhonePressed(data?.mobile!, () => setTrackActivityVisible(true));
                      } else {
                        console.log('TEXT 470');
                        ga4Analytics('PAC_Mobile_Text', {
                          contentType: 'Details',
                          itemId: 'id0409',
                        });
                        setGoalID2('7');
                        setGoalName2('Other');
                        setSubject2('Text Message');
                        handleTextPressed(data?.mobile!, () => setTrackActivityVisible(true));
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
            lightOrDark={lightOrDark}
            contactName={contactName()}
            onSave={saveComplete}
            setModalVisible={setModalVisible}
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
            guid={data?.id!}
            goalID={goalID2}
            goalName={goalName2}
            subjectP={subject2}
            firstName={data?.firstName}
            lastName={data?.lastName}
            onSave={trackActivityComplete}
            setModalVisible={setTrackActivityVisible}
          />
        </Modal>
      )}
    </View>
  );
}

const stylesDetail = StyleSheet.create({
  topContainerDark: {
    height: 0.72 * deviceHeight,
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: 0.72 * deviceHeight,
    backgroundColor: 'white',
  },
  personName: {
    marginTop: 20,
    marginLeft: 20,
    color: '#1398F5',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 30,
  },
  sectionTitle: {
    marginLeft: 20,
    color: 'gray',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 5,
  },
  bottomContainerDark: {
    backgroundColor: 'black',
  },
  bottomContainerLight: {
    backgroundColor: 'white',
  },
  standardTextDark: {
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
  },
  standardTextLight: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
  },
  cityStateZipTextDark: {
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  cityStateZipTextLight: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  phoneNumber: {
    color: '#1398F5',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    width: 180,
    marginBottom: 15,
  },
  completeText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  postponeText: {
    color: '#F99055',
    textAlign: 'center',
    fontSize: 20,
  },
});
