import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import { getRelDetails, getToDos, deleteRelationship, changeRankAndQual, editContact } from './api';
import { RelDetailsProps, ToDoAndApptProps, RolodexDataProps } from './interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import {
  formatDate,
  handleTextPressed,
  handlePhonePressed,
  handleEmailPressed2,
  handleMapPressed2,
  isNullOrEmpty,
} from '../../utils/general';
import openMap from 'react-native-open-maps';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { GoalDataProps } from '../Goals/interfaces';
import { testForNotificationTrack } from '../Goals/handleWinNotifications';
import { ideasMenu, vidMenu, mobileTypeMenu, homeTypeMenu, officeTypeMenu, relSheets } from './relationshipHelpers';
import { getGoalData, trackAction } from '../Goals/api';
import { handleVideoFromAlbum, handleVideoFromCamera } from './videoHelpers';
import * as SMS from 'expo-sms';
import Dialog from 'react-native-dialog';
import { ga4Analytics } from '../../utils/general';

const chevron = require('../../images/chevron_blue_right.png');
import TrackActivity from '../Goals/TrackActivityScreen';
import AddToDo from '../ToDo/AddToDoScreen';
import AddAppointment from '../Calendar/AddAppointmentScreen';
import { savePop, removePop } from '../PopBys/api';

const aPlusSel = require('../Relationships/images/aPlusSel.png');
const aPlusReg = require('../Relationships/images/aPlusReg.png');
const aSel = require('../Relationships/images/aSel.png');
const aReg = require('../Relationships/images/aReg.png');
const bSel = require('../Relationships/images/bSel.png');
const bReg = require('../Relationships/images/bReg.png');
const cSel = require('../Relationships/images/cSel.png');
const cReg = require('../Relationships/images/cReg.png');
const dSel = require('../Relationships/images/dSel.png');
const dReg = require('../Relationships/images/dReg.png');

const qualChecked = require('../Relationships/images/qualChecked.png');
const qualUnchecked = require('../Relationships/images/qualUnchecked.png');

const messageImg = require('../Relationships/images/relMessage.png');
const callImg = require('../Relationships/images/relCall.png');
const videoImg = require('../Relationships/images/relVid.png');
const emailImg = require('../Relationships/images/relEmail.png');
const mapImg = require('../Relationships/images/relMap.png');
const activityImg = require('../Relationships/images/relActivity.png');
const toDoImg = require('../Relationships/images/relToDo.png');
const transImg = require('../Relationships/images/relTransaction.png');
const apptImg = require('../Relationships/images/relAppt.png');
const ideasImg = require('../Relationships/images/relIdeas.png');

var phoneArray: string[] = [];
var localGoalID = '0';
var rowFontSize = 9;

interface RelDetailsLocalProps {
  data: RelDetailsProps;
  route: any;
  onPress(): void;
  refresh(): void;
}
export default function RelationshipDetailsScreen(props: RelDetailsLocalProps) {
  const { route } = props;
  const { contactId, firstName, lastName, lightOrDark } = route.params;
  const navigation = useNavigation();
  const [theRank, setTheRank] = useState('D');
  const [isQual, setIsQual] = useState('False');
  const [dataDetails, setDataDetails] = useState<RelDetailsProps>();
  const [dataToDos, setDataToDos] = useState<ToDoAndApptProps[]>([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [showPersonal, setShowPersonal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showToDos, setShowToDos] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showBiz, setShowBiz] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [ideaType, setIdeaType] = useState('Calls');
  const [vidSource, setVidSource] = useState('');
  const [modalCallsVisible, setModalCallsVisible] = useState(false);
  const [modalNotesVisible, setModalNotesVisible] = useState(false);
  const [modalPopVisible, setModalPopVisible] = useState(false);
  const [trackActivityVisible, setTrackActivityVisible] = useState(false);
  const [addToDoVisible, setAddToDoVisible] = useState(false);
  const [addAppointmentVisible, setAddAppointmentVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState('False');
  const [vidTitle, setVidTitle] = useState('');
  const [showVidTitle, setShowVidTitle] = useState(false);
  const [goalList, setGoalList] = useState<GoalDataProps[]>([]);
  const [goalID2, setGoalID2] = useState('1');
  const [goalName2, setGoalName2] = useState('Calls Made');
  const [subject2, setSubject2] = useState('');

  async function getVidTutWatched() {
    const vidTutWatched = await storage.getItem('videoTutorialWatched');
    if (vidTutWatched == null || vidTutWatched == 'False') {
      return false;
    }
    return true;
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

  function saveToDoComplete() {
    setIsLoading(true);
    console.log('saveToDoComplete');
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

  function saveAppointmentComplete() {
    console.log('saveAppointmentComplete');
  }

  function trackSuccess() {
    setIsLoading(false);
    console.log('track success 1');
    fetchGoals();
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

  function trackFailure() {
    setIsLoading(false);
    console.log('track failure');
  }

  function backPressed() {
    quickUpdateRankQual();
  }

  function editPressed() {
    ga4Analytics('Relationships_Edit', {
      contentType: 'none',
      itemId: 'id0508',
    });
    if (dataDetails == null) return;
    navigation.navigate('EditRelationshipScreen', {
      data: dataDetails,
      lightOrDark: lightOrDark,
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.editAndBackText} onPress={editPressed}>
          <Text style={styles.editAndBackText}>Edit</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.editAndBackText} onPress={backPressed}>
          <Text style={styles.editAndBackText}>Back</Text>
        </TouchableOpacity>
      ),
    });
    navigation.setOptions({ title: fullName() });
  }, [navigation, dataDetails, theRank, isQual, ideaType]);

  useEffect(() => {
    let isMounted = true;
    fetchRelDetails(isMounted);
    console.log('is focused');
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchToDos(isMounted);
    console.log('is focused');
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function quickUpdateRankQual() {
    console.log('guid: ' + dataDetails?.id!);
    console.log('the rank: ' + theRank);

    changeRankAndQual(dataDetails?.id!, theRank, isQual)
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          Alert.alert(res.error);
        } else {
          //   console.log(res);
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function showDialog(source: string) {
    console.log('source: ' + source);
    setShowVidTitle(true);
  }

  function handleCancel() {
    console.log('HANDLE CANCEL');
    setShowVidTitle(false);
  }

  function handleVidTitleOK() {
    console.log('HANDLE VID SOURCE: ' + vidSource);
    setShowVidTitle(false);
    const timer = setInterval(() => {
      clearInterval(timer);
      setGoalID2('7');
      setGoalName2('Other');
      setSubject2('Text Video');
      setIsLoading(true);
      if (vidSource == 'Use Video Album') {
        handleVideoFromAlbum(
          vidTitle,
          dataDetails,
          () => setIsLoading(false),
          () => {
            setTrackActivityVisible(true);
            setIsLoading(false);
          }
        );
      } else {
        handleVideoFromCamera(
          vidTitle,
          dataDetails,
          () => setIsLoading(false),
          () => {
            setTrackActivityVisible(true);
            setIsLoading(false);
          }
        );
      }
    }, 2000); // wait for dialog to close
  }

  function handleMobilePressed() {
    SheetManager.show(relSheets.mobileSheet);
  }

  function handleHomePressed() {
    ga4Analytics('Relationships_Phone_Call', {
      contentType: 'Home',
      itemId: 'id0520',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(dataDetails?.homePhone!, () => setTrackActivityVisible(true));
  }

  function handleOfficePressed() {
    ga4Analytics('Relationships_Phone_Call', {
      contentType: 'Office',
      itemId: 'id0520',
    });
    setGoalID2('1');
    setGoalName2('Calls Made');
    setSubject2('Mobile Call');
    handlePhonePressed(dataDetails?.officePhone!, () => setTrackActivityVisible(true));
  }

  function handleCallPressed() {
    console.log('call pressed');
    if (filterPhoneNumbers().length == 0) {
      Alert.alert('Please enter at least one phone number');
    } else if (filterPhoneNumbers().length == 1) {
      if (filterPhoneNumbers().includes('Mobile')) {
        setGoalID2('1');
        setGoalName2('Calls Made');
        setSubject2('Mobile Call');
        handlePhonePressed(dataDetails?.mobile!, () => setTrackActivityVisible(true));
      } else if (filterPhoneNumbers().includes('Home')) {
        setGoalID2('1');
        setGoalName2('Calls Made');
        setSubject2('Mobile Call');
        handlePhonePressed(dataDetails?.homePhone!, () => setTrackActivityVisible(true));
      } else {
        setGoalID2('1');
        setGoalName2('Calls Made');
        setSubject2('Mobile Call');
        handlePhonePressed(dataDetails?.officePhone!, () => setTrackActivityVisible(true));
      }
    } else {
      SheetManager.show(relSheets.callSheet);
    }
  }

  function handleWebsitePressed() {
    try {
      console.log('NEWWEB');
      var newWeb = dataDetails?.website!;
      if (dataDetails?.website == '') {
        return;
      }
      if (!dataDetails?.website.includes('http')) {
        newWeb = 'https://' + dataDetails?.website;
      }
      console.log('NEWWEB: ' + newWeb);
      Linking.openURL(newWeb);
    } catch {
      Alert.alert('Error loading website');
    }
  }

  function filterPhoneNumbers() {
    phoneArray = [];
    if (dataDetails?.mobile != null && dataDetails?.mobile.length > 6) {
      console.log('added mobile phone');
      phoneArray.push('Mobile');
    }
    if (dataDetails?.homePhone != null && dataDetails?.homePhone.length > 6) {
      phoneArray.push('Home');
    }
    if (dataDetails?.officePhone != null && dataDetails?.officePhone.length > 6) {
      phoneArray.push('Office');
    }
    console.log('phone array size: ' + phoneArray.length);
    return phoneArray;
  }

  // Top Row

  async function handleMessagePressed() {
    ga4Analytics('Relationships_Message_Top', {
      contentType: 'none',
      itemId: 'id0509',
    });
    console.log(dataDetails?.mobile);
    if (dataDetails?.mobile == null || dataDetails?.mobile.length < 7) {
      Alert.alert('Please enter a valid phone number');
      return;
    }
    setGoalID2('7');
    setGoalName2('Other');
    setSubject2('Text Message');
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      handleTextPressed(dataDetails?.mobile!, () => setTrackActivityVisible(true));
    }
  }

  async function handleVideoPressed() {
    var watched = await getVidTutWatched();
    console.log('WATCHED: ' + watched);
    console.log('video pressed');
    if (dataDetails?.mobile == '') {
      Alert.alert('Please enter a mobile number');
      return;
    }
    if (!watched) {
      Alert.alert(
        'Upload times will vary with size of the video and network speed. It may take up to several minutes to upload. For best results, we recommend videos no longer than 60 seconds in length'
      );
      storage.setItem('videoTutorialWatched', 'True');
    }
    SheetManager.show(relSheets.vidSheet);
  }

  function handleEmailPressed() {
    // Linking.openURL(`mailto:${dataDetails?.email}`);
    ga4Analytics('Relationships_Email_Top', {
      contentType: 'none',
      itemId: 'id0513',
    });
    if (dataDetails?.email == null || dataDetails?.email == '') {
      Alert.alert('Please enter an email address');
      return;
    }
    setGoalID2('7');
    setGoalName2('Other');
    setSubject2('Email Sent');
    handleEmailPressed2(dataDetails?.email!, () => setTrackActivityVisible(true));
  }

  function handleMapPressed() {
    ga4Analytics('Relationships_Map_Top', {
      contentType: 'none',
      itemId: 'id0514',
    });
    setGoalID2('3');
    setGoalName2('Pop-By Made');
    setSubject2('Pop-By');
    if (completeAddress().length > 0) {
      handleMapPressed2(completeAddress(), () => setTrackActivityVisible(true));
    } else {
      Alert.alert('Please enter an address');
    }
    //  handleDirectionsPressed();
  }

  // bottom row

  function handleActivityPressed() {
    ga4Analytics('Relationships_Activity_Bottom', {
      contentType: 'none',
      itemId: 'id0515',
    });
    setTrackActivityVisible(!trackActivityVisible);
  }

  function handleToDoPressed() {
    ga4Analytics('Relationships_ToDo_Bottom', {
      contentType: 'none',
      itemId: 'id0516',
    });
    setAddToDoVisible(!addToDoVisible);
  }

  function handleTransactionPressed() {
    ga4Analytics('Relationships_Transaction_Bottom', {
      contentType: 'none',
      itemId: 'id0517',
    });
    var person: RolodexDataProps = {
      id: dataDetails?.id!,
      firstName: dataDetails?.firstName!,
      lastName: dataDetails?.lastName!,
      ranking: '',
      contactTypeID: '',
      employerName: '',
      qualified: false,
      mobile: '',
      homePhone: '',
      officePhone: '',
    };

    navigation.navigate('AddTxMenu', {
      person: person,
      source: 'Relationships',
    });
  }

  function handleApptPressed() {
    ga4Analytics('Relationships_Appointment_Bottom', {
      contentType: 'none',
      itemId: 'id0518',
    });
    setAddAppointmentVisible(!addAppointmentVisible);
  }

  function handleIdeasPressed() {
    console.log('ideas pressed');
    SheetManager.show(relSheets.ideaSheet);
  }

  // End of bottom row

  function handleReferralPressed() {
    console.log('referral pressed');
    navigation.push('RelDetails', {
      contactId: dataDetails?.referredBy.id!,
      firstName: dataDetails?.referredBy.name,
      lastName: '',
      lightOrDark: lightOrDark,
    });
  }

  function handleSpousePressed() {
    console.log('spouse pressed');
    navigation.push('RelDetails', {
      contactId: dataDetails?.spouse.id,
      firstName: dataDetails?.spouse.name,
      lastName: '',
      lightOrDark: lightOrDark,
    });
  }

  function handleHistoryPressed(notes: string) {
    if (notes != '') Alert.alert(notes);
  }

  function handleToDoItemPressed(thisEventID: string, thisEventType: string) {
    console.log('ID:' + thisEventID);
    console.log('Type:' + thisEventType);
    if (thisEventType == 'Appointment') {
      navigation.navigate('ApptDetails', {
        apptID: thisEventID,
        lightOrDark: lightOrDark,
      });
    } else {
      navigation.navigate('toDoDetails', {
        toDoID: thisEventID,
        lightOrDark: lightOrDark,
      });
    }
  }

  function handleTransactionItemPressed(thisTransactionID: number, thisTxType: string) {
    console.log('ID: ' + thisTransactionID);
    console.log('Type: ' + thisTxType);
    if (thisTxType == 'Realtor') {
      navigation.navigate('RealEstateTxDetails', {
        dealID: thisTransactionID,
        lightOrDark: lightOrDark,
      });
    } else if (thisTxType == 'Lender') {
      navigation.navigate('LenderTxDetails', {
        dealID: thisTransactionID,
        lightOrDark: lightOrDark,
      });
    } else {
      navigation.navigate('OtherTxDetails', {
        dealID: thisTransactionID,
        lightOrDark: lightOrDark,
      });
    }
  }

  function handleGroupPressed(thisGroupID: string, thisGroupName: string) {
    console.log('this group: ' + thisGroupID);
    navigation.navigate('GroupMembersScreen', {
      groupID: thisGroupID,
      groupName: thisGroupName,
      lightOrDark: lightOrDark,
    });
  }

  function showSection0() {
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.birthday)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary)) return true;
    return false;
  }

  function showSection1() {
    if (!isNullOrEmpty(dataDetails?.historyNotes)) return true;
    return false;
  }

  function showSection2() {
    if (!isNullOrEmpty(dataToDos)) return true;
    return false;
  }

  function showSection3() {
    if (!isNullOrEmpty(dataDetails?.transactions)) return true;
    return false;
  }

  function showSection4() {
    if (!isNullOrEmpty(dataDetails?.groupsNotes)) return true;
    return false;
  }

  function showSection5() {
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes)) return true;
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.employerName)) return true;
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.occupation)) return true;
    return false;
  }

  function showSection6() {
    if (!isNullOrEmpty(dataDetails?.interestsAndFavorites.notes)) {
      return true;
    }
    return false;
  }

  function handleSavePopByPressed() {
    if (isFavorite == 'False') {
      console.log('Save Pop-By Pressed False');
      savePop(dataDetails?.id!);
      setIsFavorite('True');
      Alert.alert(dataDetails?.firstName + ' added to Saved list');
    }
  }

  function handleUnsavePopByPressed() {
    if (isFavorite == 'True') {
      console.log('UnSave Pop-By Pressed');
      removePop(dataDetails?.id!);
      setIsFavorite('False');
      Alert.alert(dataDetails?.firstName + ' removed from Saved list');
    }
  }

  function fullName() {
    console.log('biz or rel: ' + dataDetails?.contactTypeID);
    if (dataDetails?.contactTypeID == 'Biz') {
      return dataDetails.businessAndCareer.employerName;
    }
    var newFirst = '';
    var newLast = '';
    if (!isNullOrEmpty(firstName)) {
      newFirst = firstName;
    }
    if (!isNullOrEmpty(lastName)) {
      newLast = lastName;
    }
    return ' ' + newFirst + ' ' + newLast;
  }

  function handleSectionTap(sectionIndex: number) {
    if (sectionIndex == 0) {
      setShowPersonal(!showPersonal);
    }
    if (sectionIndex == 1) {
      fetchRelDetails(true);
      setShowActivity(!showActivity);
    }
    if (sectionIndex == 2) {
      setShowToDos(!showToDos);
    }
    if (sectionIndex == 3) {
      setShowTransactions(!showTransactions);
    }
    if (sectionIndex == 4) {
      setShowGroups(!showGroups);
    }
    if (sectionIndex == 5) {
      setShowBiz(!showBiz);
    }
    if (sectionIndex == 6) {
      setShowInterests(!showInterests);
    }
  }

  function deletePressed() {
    Alert.alert(
      'Delete ' + dataDetails?.firstName + ' ' + dataDetails?.lastName + '?',
      '',
      [
        {
          text: 'Delete',
          onPress: () => deletePressedContinue(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function deletePressedContinue() {
    ga4Analytics('Relationships_Delete', {
      contentType: 'none',
      itemId: 'id0522',
    });
    setIsLoading(true);
    deleteRelationship(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          //  console.log(res.data);
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleDirectionsPressed() {
    // openMap({ latitude: 33.1175, longitude: -117.0722, zoom: 10 });
    //   openMap({ query: '7743 Royal Park Dr. Lewis Center OH 43035' });
    setGoalID2('3');
    setGoalName2('Pop-By Made');
    setSubject2('Pop-By');
    if (completeAddress().length > 0) {
      handleMapPressed2(completeAddress(), () => setTrackActivityVisible(true));
    } else {
      Alert.alert('Please enter an address');
    }
    //  openMap({ query: completeAddress() });
  }

  function completeAddress() {
    var addressString = '';
    if (dataDetails?.address.street != null && dataDetails?.address.street != '') {
      addressString = dataDetails?.address.street;
    }
    if (dataDetails?.address.street2 != null && dataDetails?.address.street2 != '') {
      addressString = addressString + ' ' + dataDetails?.address.street2;
    }
    if (dataDetails?.address.city != null && dataDetails?.address.city != '') {
      addressString = addressString + ' ' + dataDetails?.address.city;
    }
    if (dataDetails?.address.state != null && dataDetails?.address.state != '') {
      addressString = addressString + ' ' + dataDetails?.address.state;
    }
    if (dataDetails?.address.zip != null && dataDetails?.address.zip != '') {
      addressString = addressString + ' ' + dataDetails?.address.zip;
    }
    console.log('address length: ' + addressString.length);
    return addressString;
  }

  function fetchRelDetails(isMounted: boolean) {
    setIsLoading(true);
    getRelDetails(contactId)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataDetails(res.data);
          //  data = res.data;
          setTheRank(res.data.ranking);
          setIsQual(res.data.qualified);
          setIsFavorite(res.data.address.isFavorite);
          //   console.log('dataDetails:' + res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function getRankButtonImage(rankPressed: string) {
    if (rankPressed == 'A+') {
      if (theRank == 'A+') {
        return aPlusSel;
      }
      return aPlusReg;
    }
    if (rankPressed == 'A') {
      if (theRank == 'A') {
        return aSel;
      }
      return aReg;
    }
    if (rankPressed == 'B') {
      if (theRank == 'B') {
        return bSel;
      }
      return bReg;
    }
    if (rankPressed == 'C') {
      if (theRank == 'C') {
        return cSel;
      }
      return cReg;
    }
    if (rankPressed == 'D') {
      if (theRank == 'D') {
        return dSel;
      }
      return dReg;
    }
  }

  function handleRankPress(rank: string) {
    console.log('rank1: ' + rank);
    //  if(theRank == 'A+')
    setTheRank(rank);
    dataDetails!.ranking = rank;
    setDataDetails(dataDetails);
  }

  function handleQualPress() {
    dataDetails!.qualified = isQual == 'False' ? 'True' : 'False';
    setIsQual(isQual == 'False' ? 'True' : 'False');
    setDataDetails(dataDetails);
  }

  function fetchToDos(isMounted: boolean) {
    setIsLoading(true);
    getToDos(contactId)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataToDos(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function cityStateZip(city?: string, state?: string, zip?: string) {
    var addressString = '';
    if (city != null) {
      addressString = city;
    }
    if (state != null) {
      addressString = addressString + ' ' + state;
    }
    if (zip != null) {
      addressString = addressString + ' ' + zip;
    }
    return addressString;
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <Dialog.Container visible={showVidTitle}>
        <Dialog.Title>Video Title</Dialog.Title>
        <TextInput
          style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
          placeholder="+ Add"
          placeholderTextColor="#AFB9C2"
          textAlign="left"
          onChangeText={(text) => setVidTitle(text)}
          defaultValue={''}
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="OK" onPress={handleVidTitleOK} />
      </Dialog.Container>

      <View style={styles.topAndBottomRows}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleMessagePressed()}>
            <Image source={messageImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Message</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleCallPressed()}>
            <Image source={callImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Call</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleVideoPressed()}>
            <Image source={videoImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Video</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleEmailPressed()}>
            <Image source={emailImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Email</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleMapPressed()}>
            <Image source={mapImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Map</Text>}
        </View>
      </View>

      <ScrollView style={lightOrDark == 'dark' ? styles.scrollViewDark : styles.scrollViewLight}>
        <View style={styles.rankTitleRow}>
          <Text style={styles.subTitle}>Ranking</Text>
          <Text style={styles.subTitle}>Qualified</Text>
        </View>

        <View style={styles.rankAndQualRow}>
          <View style={lightOrDark == 'dark' ? styles.rankSection : styles.rankSection}>
            <TouchableOpacity onPress={() => handleRankPress('A+')}>
              <Image source={getRankButtonImage('A+')} style={styles.rankButton} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRankPress('A')}>
              <Image source={getRankButtonImage('A')} style={styles.rankButton} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRankPress('B')}>
              <Image source={getRankButtonImage('B')} style={styles.rankButton} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRankPress('C')}>
              <Image source={getRankButtonImage('C')} style={styles.rankButton} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRankPress('D')}>
              <Image source={getRankButtonImage('D')} style={styles.rankButton} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handleQualPress()}>
            <Image source={isQual == 'True' ? qualChecked : qualUnchecked} style={styles.qualButton} />
          </TouchableOpacity>
        </View>

        <Text></Text>

        {isLoading == true && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        )}

        <Text style={styles.subTitle}>Pop-By</Text>
        <View style={styles.topAndBottomRows}>
          <TouchableOpacity style={styles.pairRows} onPress={() => handleSavePopByPressed()}>
            <Text style={isFavorite == 'False' ? styles.saveText : styles.savedText}>
              {isFavorite == 'False' ? 'Save' : 'Saved'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pairRows} onPress={() => handleUnsavePopByPressed()}>
            <Text style={styles.removeText}>{isFavorite == 'True' ? 'Remove' : ''}</Text>
          </TouchableOpacity>
        </View>

        {dataDetails?.contactTypeID == 'Biz' && <Text style={styles.subTitle}>Primary Contact</Text>}
        {dataDetails?.contactTypeID == 'Biz' && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.firstName + ' ' + dataDetails?.lastName}
          </Text>
        )}

        {!isNullOrEmpty(dataDetails?.mobile) && <Text style={styles.subTitle}>Mobile Phone Number</Text>}
        <TouchableOpacity onPress={() => handleMobilePressed()}>
          {!isNullOrEmpty(dataDetails?.mobile) && <Text style={styles.phoneAndEmail}>{dataDetails?.mobile}</Text>}
        </TouchableOpacity>

        {!isNullOrEmpty(dataDetails?.homePhone) && <Text style={styles.subTitle}>Home Phone Number</Text>}
        <TouchableOpacity onPress={() => handleHomePressed()}>
          {!isNullOrEmpty(dataDetails?.homePhone) && <Text style={styles.phoneAndEmail}>{dataDetails?.homePhone}</Text>}
        </TouchableOpacity>

        {!isNullOrEmpty(dataDetails?.officePhone) && <Text style={styles.subTitle}>Office Phone Number</Text>}
        <TouchableOpacity onPress={() => handleOfficePressed()}>
          {!isNullOrEmpty(dataDetails?.officePhone) && (
            <Text style={styles.phoneAndEmail}>{dataDetails?.officePhone}</Text>
          )}
        </TouchableOpacity>

        {!isNullOrEmpty(dataDetails?.email) && <Text style={styles.subTitle}>Email</Text>}
        <TouchableOpacity onPress={() => handleEmailPressed()}>
          {!isNullOrEmpty(dataDetails?.email) && <Text style={styles.phoneAndEmail}>{dataDetails?.email}</Text>}
        </TouchableOpacity>

        {!isNullOrEmpty(dataDetails?.website) && <Text style={styles.subTitle}>Website</Text>}
        <TouchableOpacity onPress={() => handleWebsitePressed()}>
          {!isNullOrEmpty(dataDetails?.website) && <Text style={styles.phoneAndEmail}>{dataDetails?.website}</Text>}
        </TouchableOpacity>

        {!isNullOrEmpty(dataDetails?.spouse.id) && <Text style={styles.subTitle}>Spouse</Text>}
        {!isNullOrEmpty(dataDetails?.spouse.id) && (
          <TouchableOpacity onPress={() => handleSpousePressed()}>
            <View style={styles.textAndChevronRow}>
              <View style={styles.referralAndSpouseText}>
                <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                  {dataDetails?.spouse.name}
                </Text>
              </View>

              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {completeAddress().length > 0 && (
          <View style={styles.topAndBottomRows}>
            <Text style={styles.subTitle}>Location</Text>
            <TouchableOpacity style={styles.pairRows} onPress={() => handleDirectionsPressed()}>
              <Text style={styles.directionsText}>{'Directions'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isNullOrEmpty(dataDetails?.address.street) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street}
          </Text>
        )}
        {!isNullOrEmpty(dataDetails?.address.street2) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street2}
          </Text>
        )}
        {!isNullOrEmpty(dataDetails?.address.city) &&
          !isNullOrEmpty(dataDetails?.address.state) &&
          !isNullOrEmpty(dataDetails?.address.zip) && (
            <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
              {cityStateZip(dataDetails?.address.city, dataDetails?.address.state, dataDetails?.address.zip)}
            </Text>
          )}
        {!isNullOrEmpty(dataDetails?.address.country) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.country}
          </Text>
        )}

        <Text></Text>
        {!isNullOrEmpty(dataDetails?.notes) && <Text style={styles.subTitle}>Notes</Text>}
        {!isNullOrEmpty(dataDetails?.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.notes}</Text>
        )}

        {!isNullOrEmpty(dataDetails?.referredBy.id) && <Text style={styles.subTitle}>Referred By</Text>}
        {!isNullOrEmpty(dataDetails?.referredBy.id) && (
          <TouchableOpacity onPress={() => handleReferralPressed()}>
            <View style={styles.textAndChevronRow}>
              <View style={styles.referralAndSpouseText}>
                <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                  {dataDetails?.referredBy.name}
                </Text>
              </View>

              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          {showSection0() && (
            <Text style={styles.sectionText}>
              {showPersonal ? 'Hide Personal and Family' : 'Show Personal and Family'}
            </Text>
          )}
        </TouchableOpacity>
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={styles.subTitle}>Birthday</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {formatDate(dataDetails?.personalAndFamily.birthday)}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={styles.subTitle}>Wedding Anniversary</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {formatDate(dataDetails?.personalAndFamily.weddingAnniversary)}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames) && (
          <Text style={styles.subTitle}>Children's Names</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.childrensNames}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes) && (
          <Text style={styles.subTitle}>Notes</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.personalNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          {showSection1() && (
            <Text style={styles.sectionText}>{showActivity ? 'Hide Activity History' : 'Show Activity History'}</Text>
          )}
        </TouchableOpacity>
        {showActivity && showSection1() && (
          <React.Fragment>
            {dataDetails?.historyNotes.map((item, index) => (
              <TouchableOpacity onPress={() => handleHistoryPressed(dataDetails?.historyNotes[index].notes)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                      {item.activityDateTime}: {item.activityType} - {item.subject}
                    </Text>
                  </View>

                  {!isNullOrEmpty(dataDetails?.historyNotes[index].notes) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          {showSection2() && (
            <Text style={styles.sectionText}>
              {showToDos ? 'Hide To-Dos and Appointments' : 'Show To-Dos and Appointments'}
            </Text>
          )}
        </TouchableOpacity>

        {showToDos && showSection2() && (
          <React.Fragment>
            {dataToDos.map((item, index) => (
              <TouchableOpacity onPress={() => handleToDoItemPressed(item.EventID, item.EventType)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                      {item.DateToUse}: {item.Title}
                    </Text>
                  </View>

                  {!isNullOrEmpty(item.EventID) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          {showSection3() && (
            <Text style={styles.sectionText}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</Text>
          )}
        </TouchableOpacity>

        {/* { <Text style={styles.bookMark}>Bookmark</Text>} */}

        {showTransactions && showSection3() && (
          <React.Fragment>
            {dataDetails?.transactions.map((item, index) => (
              <TouchableOpacity onPress={() => handleTransactionItemPressed(item.dealId, item.transactionType)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <React.Fragment>
                      <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                        {item.transactionType}
                      </Text>
                      <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                        {item.closingDate}: {item.transactionStatus} {item.transactionName} (${item.closingPrice})
                      </Text>
                    </React.Fragment>
                  </View>

                  {!isNullOrEmpty(item.dealId) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          {showSection4() && <Text style={styles.sectionText}>{showGroups ? 'Hide Groups' : 'Show Groups'}</Text>}
        </TouchableOpacity>

        {showGroups && showSection4() && (
          <React.Fragment>
            {dataDetails?.groupsNotes.map((item, index) => (
              <TouchableOpacity onPress={() => handleGroupPressed(item.groupId, item.groupName)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{item.groupName}</Text>
                  </View>

                  {!isNullOrEmpty(item.groupId) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(5)}>
          {showSection5() && (
            <Text style={styles.sectionText}>{showBiz ? 'Hide Business and Career' : 'Show Business and Career'}</Text>
          )}
        </TouchableOpacity>
        {showBiz && showSection5() && (
          <Text style={styles.subTitle}>{dataDetails?.contactTypeID == 'Biz' ? 'Company Name' : 'Employer Name'}</Text>
        )}
        {showBiz && showSection5() && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.employerName}
          </Text>
        )}
        {showBiz &&
          !isNullOrEmpty(dataDetails?.businessAndCareer) &&
          !isNullOrEmpty(dataDetails?.businessAndCareer.occupation) && (
            <Text style={styles.subTitle}>
              {dataDetails?.contactTypeID == 'Biz' ? 'Services Provided' : 'Occupation'}
            </Text>
          )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.occupation) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.occupation}
          </Text>
        )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes) && (
          <Text style={styles.subTitle}>{dataDetails?.contactTypeID == 'Biz' ? 'Business Notes' : 'Career Notes'}</Text>
        )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.careerNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(6)}>
          {showSection6() && (
            <Text style={styles.sectionText}>
              {showInterests ? 'Hide Interests and Favorites' : 'Show Interests and Favorites'}
            </Text>
          )}
        </TouchableOpacity>
        {showInterests && !isNullOrEmpty(dataDetails?.interestsAndFavorites.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.interestsAndFavorites.notes}
          </Text>
        )}
        <TouchableOpacity onPress={deletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Text></Text>
        {modalCallsVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCallsVisible}
            onRequestClose={() => {
              setModalCallsVisible(!modalCallsVisible);
            }}
          >
            <IdeasCalls setModalCallsVisible={setModalCallsVisible} />
          </Modal>
        )}
        {modalNotesVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalNotesVisible}
            onRequestClose={() => {
              setModalNotesVisible(!modalNotesVisible);
            }}
          >
            <IdeasNotes setModalNotesVisible={setModalNotesVisible} />
          </Modal>
        )}
        {modalPopVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalPopVisible}
            onRequestClose={() => {
              setModalPopVisible(!modalPopVisible);
            }}
          >
            <IdeasPop setModalPopVisible={setModalPopVisible} />
          </Modal>
        )}
      </ScrollView>

      <View style={styles.topAndBottomRows}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleActivityPressed()}>
            <Image source={activityImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Activity
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleToDoPressed()}>
            <Image source={toDoImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              To-Do
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleTransactionPressed()}>
            <Image source={transImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Transaction
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleApptPressed()}>
            <Image source={apptImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>Appt</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleIdeasPressed()}>
            <Image source={ideasImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Ideas
            </Text>
          }
        </View>

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('call top row sheet')}
          id={relSheets.callSheet}
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
                {filterPhoneNumbers().map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      console.log(value);
                      SheetManager.hide(relSheets.callSheet, null).then(() => {
                        ga4Analytics('Relationships_Call_Top', {
                          contentType: value,
                          itemId: 'id0510',
                        });
                        setGoalID2('1');
                        setGoalName2('Calls Made');
                        setSubject2('Mobile Call');
                        if (value == 'Mobile') {
                          if (dataDetails?.mobile == '') {
                            Alert.alert('Please enter a Mobile number');
                          } else {
                            handlePhonePressed(dataDetails?.mobile!, () => setTrackActivityVisible(true));
                          }
                        } else if (value == 'Home') {
                          if (dataDetails?.homePhone == '') {
                            Alert.alert('Please enter a Home number');
                          } else {
                            handlePhonePressed(dataDetails?.homePhone!, () => setTrackActivityVisible(true));
                          }
                        } else {
                          if (dataDetails?.officePhone == '') {
                            Alert.alert('Please enter an Office number');
                          } else {
                            handlePhonePressed(dataDetails?.officePhone!, () => setTrackActivityVisible(true));
                          }
                        }
                      });
                    }}
                    style={globalStyles.listItemCell}
                  >
                    <Text style={globalStyles.listItem}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ActionSheet>

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
                        console.log('CALLTYPE: ' + value);
                        if (value == 'Call') {
                          ga4Analytics('Relationships_Phone_Call', {
                            contentType: 'Mobile',
                            itemId: 'id0520',
                          });
                          setGoalID2('1');
                          setGoalName2('Calls Made');
                          setSubject2('Mobile Call');
                          handlePhonePressed(dataDetails?.mobile!, () => setTrackActivityVisible(true));
                        } else {
                          ga4Analytics('Relationships_Mobile_Text', {
                            contentType: 'Mobile',
                            itemId: 'id0521',
                          });
                          setGoalID2('7');
                          setGoalName2('Other');
                          setSubject2('Text Message');
                          handleTextPressed(dataDetails?.mobile!, () => setTrackActivityVisible(true));
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

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('home call type sheet')}
          id={relSheets.homeSheet}
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
                {Object.entries(homeTypeMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(relSheets.homeSheet, null).then(() => {
                        console.log('CALLTYPE: ' + value);
                        if (value == 'Call') {
                          setGoalID2('1');
                          setGoalName2('Calls Made');
                          setSubject2('Mobile Call');
                          handlePhonePressed(dataDetails?.homePhone!, () => setTrackActivityVisible(true));
                        } else {
                          setGoalID2('7');
                          setGoalName2('Other');
                          setSubject2('Text Message');
                          handleTextPressed(dataDetails?.homePhone!, () => setTrackActivityVisible(true));
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

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('work call sheet')}
          id={relSheets.officeSheet}
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
                {Object.entries(officeTypeMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(relSheets.officeSheet, null).then(() => {
                        console.log('CALLTYPE: ' + value);
                        if (value == 'Call') {
                          setGoalID2('1');
                          setGoalName2('Calls Made');
                          setSubject2('Mobile Call');
                          handlePhonePressed(dataDetails?.officePhone!, () => setTrackActivityVisible(true));
                        } else {
                          setGoalID2('7');
                          setGoalName2('Other');
                          setSubject2('Text Message');
                          handleTextPressed(dataDetails?.officePhone!, () => setTrackActivityVisible(true));
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

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('idea sheet')}
          id={relSheets.ideaSheet}
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
                {Object.entries(ideasMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      console.log(value);
                      SheetManager.hide(relSheets.ideaSheet, null).then(() => {
                        ga4Analytics('Relationships_Ideas_Bottom', {
                          contentType: value,
                          itemId: 'id0519',
                        });
                        if (value == 'Calls') {
                          setModalCallsVisible(true);
                        } else if (value == 'Notes') {
                          setModalNotesVisible(true);
                        } else {
                          setModalPopVisible(true);
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

        <ActionSheet
          initialOffsetFromBottom={10}
          onBeforeShow={(data) => console.log('vid sheet')}
          id={relSheets.vidSheet}
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
                {Object.entries(vidMenu).map(([index, value]) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SheetManager.hide(relSheets.vidSheet, null);
                      setVidSource(value);
                      const timer = setInterval(() => {
                        clearInterval(timer);
                        if (dataDetails?.hasBombBombPermission!) {
                          showDialog(value);
                        } else {
                          setGoalID2('7');
                          setGoalName2('Other');
                          setSubject2('Text Video');
                          setIsLoading(true);
                          if (value == 'Use Video Album') {
                            handleVideoFromAlbum(
                              'none',
                              dataDetails,
                              () => setIsLoading(false),
                              () => {
                                setTrackActivityVisible(true);
                                setIsLoading(false);
                              }
                            );
                          } else {
                            handleVideoFromCamera(
                              'none',
                              dataDetails,
                              () => setIsLoading(false),
                              () => {
                                setTrackActivityVisible(true);
                                setIsLoading(false);
                              }
                            );
                          }
                        }
                        //setIsLoading(false);
                      }, 250);
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
      </View>
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
            guid={dataDetails?.id!}
            goalID={goalID2}
            goalName={goalName2}
            subjectP={subject2}
            firstName={dataDetails?.firstName}
            lastName={dataDetails?.lastName}
            onSave={trackActivityComplete}
            setModalVisible={setTrackActivityVisible}
          />
        </Modal>
      )}
      {addToDoVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={addToDoVisible}
          onRequestClose={() => {
            setAddToDoVisible(!addToDoVisible);
          }}
        >
          <AddToDo
            title="New To-Do"
            guid={dataDetails?.id}
            firstName={dataDetails?.firstName}
            lastName={dataDetails?.lastName}
            onSave={saveToDoComplete}
            setModalVisible={setAddToDoVisible}
          />
        </Modal>
      )}
      {addAppointmentVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={addAppointmentVisible}
          onRequestClose={() => {
            setAddAppointmentVisible(!addAppointmentVisible);
          }}
        >
          <AddAppointment
            title={'New Appointment'}
            guid={dataDetails?.id}
            firstName={dataDetails?.firstName}
            lastName={dataDetails?.lastName}
            onSave={saveAppointmentComplete}
            setModalVisible={setAddAppointmentVisible}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    width: '100%',
    padding: 12,
  },
  bookMark: {
    fontSize: 18,
    color: 'orange',
    marginLeft: 15,
    marginBottom: 10,
  },
  editAndBackText: {
    color: 'white',
    fontSize: 16,
    marginTop: 3,
  },
  textAndChevronRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  referralAndSpouseText: {
    width: '92%',
    paddingRight: 10,
  },
  topAndBottomRows: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  rankTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    paddingTop: 5,
    paddingRight: 20,
  },
  rankAndQualRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    paddingTop: 5,
    paddingRight: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  rankSection: {
    flexDirection: 'row',
    height: 35,
  },
  rankButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
  qualButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
  directionsRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
  },
  subTitle: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 10,
  },
  scrollViewDark: {
    height: '70%',
    backgroundColor: 'black',
  },
  scrollViewLight: {
    height: '70%',
    backgroundColor: 'white',
  },
  phoneAndEmail: {
    color: '#02ABF7',
    marginLeft: 15,
    marginBottom: 10,
  },
  pair: {
    flex: 1,
    marginTop: 5,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5,
  },
  topButtonTextDark: {
    color: 'white',
    textAlign: 'center',
    fontSize: rowFontSize,
  },
  topButtonTextLight: {
    color: '#016497',
    textAlign: 'center',
    fontSize: rowFontSize,
  },
  bottomButtonTextDark: {
    color: 'white',
    textAlign: 'center',
    fontSize: rowFontSize,
  },
  bottomButtonTextLight: {
    color: '#013273',
    textAlign: 'center',
    fontSize: rowFontSize,
  },
  namesLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
  },
  namesDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
  },
  pairRows: {
    marginRight: 10,
    marginBottom: 5,
    flexDirection: 'row',
  },
  directionsText: {
    color: '#1398F5',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 5,
  },
  addressDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 2,
  },
  addressLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 16,
    color: '#02ABF7',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 15,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
  chevronBox: {
    alignContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    height: 18,
    width: 10,
  },
  saveText: {
    color: '#1398F5',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 5,
  },
  savedText: {
    color: 'gray',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 5,
  },
  removeText: {
    color: 'orange',
    fontSize: 15,
    textAlign: 'left',
    marginRight: 15,
    marginBottom: 5,
  },
  textInputDark: {
    fontSize: 18,
    color: 'white',
    width: 300,
    paddingLeft: 10,
  },
  textInputLight: {
    fontSize: 18,
    color: 'black',
    width: 300,
    paddingLeft: 10,
  },
});
