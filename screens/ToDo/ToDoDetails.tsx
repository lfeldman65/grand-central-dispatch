import { useState, useEffect } from 'react';
import { StyleSheet, Modal, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getToDoDetails, markCompleteToDo, deleteToDo } from './api';
import { ToDoDetailsDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { prettyDate, isNullOrEmpty, ga4Analytics } from '../../utils/general';
import openMap from 'react-native-open-maps';
import * as React from 'react';
import EditToDo from './EditToDoScreen';
import { getGoalDataConcise, getGoalData } from '../Goals/api';
import { GoalDataConciseProps, GoalDataProps } from '../Goals/interfaces';
import { testForNotificationTrack } from '../Goals/handleWinNotifications';

export default function ToDoDetails(props: any) {
  const navigation = useNavigation();
  const { route } = props;
  const { toDoID, lightOrDark } = route.params;
  const isFocused = useIsFocused();
  const [detailData, setDetailData] = useState<ToDoDetailsDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalList, setGoalList] = useState<GoalDataConciseProps[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    fetchGoalsConcise(true);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={editPressed}>
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function editPressed() {
    ga4Analytics('To_Do_Edit', {
      contentType: 'none',
      itemId: 'id1208',
    });
    setModalVisible(true);
  }

  function deletePressed() {
    ga4Analytics('To_Do_Delete', {
      contentType: 'none',
      itemId: 'id1207',
    });
    Alert.alert(
      'Are you sure you want to delete this To Do?',
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
    setIsLoading(true);
    deleteToDo(toDoID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleDirectionsPressed() {
    console.log('directions pressed');
    openMap({ query: detailData?.location });
  }

  function handleAttendeePressed(attendeeID: string) {
    console.log('attendee pressed: ' + attendeeID);
    navigation.navigate('RelDetails', {
      contactId: detailData?.attendees[0].id,
      firstName: detailData?.attendees[0].name,
      lastName: '',
      lightOrDark: lightOrDark,
    });
  }

  function saveComplete() {
    // After Edit/Save
    console.log('save complete');
    fetchData(true);
  }

  function fetchGoalsConcise(isMounted: boolean) {
    console.log('fetch goals');
    getGoalDataConcise()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setGoalList(res.data);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function goalIDToTitle() {
    console.log('goalID: ' + detailData?.activityTypeId!);
    if (detailData?.activityTypeId! == null || detailData?.activityTypeId! == 0) {
      return 'None';
    }
    console.log('goallistlength: ' + goalList.length);
    for (var i = 0; i < goalList.length; i++) {
      if (goalList[i].id == detailData?.activityTypeId!) {
        console.log('i=: ' + i);
        if (goalList[i].title == 'Calls Made') {
          return 'Call Made';
        }
        if (goalList[i].title == 'Notes Made') {
          return 'Note Written';
        }
        return goalList[i].title;
      }
    }
  }

  function fetchData(isMounted: boolean) {
    setIsLoading(true);
    getToDoDetails(toDoID)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDetailData(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function markComplete() {
    ga4Analytics('To_Do_Complete_Or_Close', {
      contentType: 'none',
      itemId: 'id1206',
    });
    if (detailData?.isCampaign) {
      navigation.goBack();
      return;
    }
    setIsLoading(true);
    markCompleteToDo(toDoID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          fetchGoals(true);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchGoals(isMounted: boolean) {
    setIsLoading(true);
    getGoalData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          notifyIfWin(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function notifyIfWin(data: GoalDataProps[]) {
    var i = 0;
    while (i < data.length) {
      if (data[i].goal.id == detailData?.activityTypeId!) {
        testForNotificationTrack(
          data[i].goal.title,
          data[i].goal.weeklyTarget,
          data[i].achievedThisWeek,
          data[i].achievedToday
        );
      }
      i = i + 1;
    }
    navigation.goBack();
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={lightOrDark == 'dark' ? styles.topContainerDark : styles.topContainerLight}>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>{detailData?.title}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
          {'Due: ' + prettyDate(detailData?.dueDate!)}
        </Text>
        {detailData?.priority == 'True' && <Text style={styles.priorityText}>{'High Priority'}</Text>}
        {goalIDToTitle() != 'None' && <Text style={styles.sectionHeader}>Activity</Text>}
        {goalIDToTitle() != 'None' && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{goalIDToTitle()}</Text>
        )}

        {!isNullOrEmpty(detailData?.location) && (
          <View style={styles.directionsRow}>
            <Text style={styles.sectionHeader}>Location</Text>
            <TouchableOpacity onPress={() => handleDirectionsPressed()}>
              <Text style={styles.directionsText}>{'Directions'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isNullOrEmpty(detailData?.location) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{detailData?.location!}</Text>
        )}

        {!isNullOrEmpty(detailData?.notes) && <Text style={styles.sectionHeader}>Notes</Text>}
        {!isNullOrEmpty(detailData?.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{detailData?.notes!}</Text>
        )}

        {!isNullOrEmpty(detailData?.attendees) && <Text style={styles.sectionHeader}>Relationships</Text>}

        {!isNullOrEmpty(detailData?.attendees) &&
          detailData?.attendees.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleAttendeePressed(item.id)}>
              <Text style={styles.link}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={lightOrDark == 'dark' ? styles.bottomContainerDark : styles.bottomContainerLight}>
        <Text style={styles.campaignText}>
          {detailData?.isCampaign ? 'This To-Do is part of a marketing campaign' : ''}
        </Text>
        {detailData?.completedDate == null && (
          <TouchableOpacity onPress={markComplete}>
            <Text style={styles.completeText}>{detailData?.isCampaign ? 'Close' : 'Complete'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={deletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <EditToDo
            title={'Edit To-Do'}
            todoID={detailData?.id}
            activityTypeId={detailData?.activityTypeId}
            activityTypeTitle={goalIDToTitle()}
            titleFromParent={detailData?.title}
            dateFromParent={detailData?.dueDate}
            priorityFromParent={detailData?.priority}
            locationFromParent={detailData?.location}
            attendeeFromParent={detailData?.attendees ?? []}
            notesFromParent={detailData?.notes}
            onSave={saveComplete}
            setModalVisible={setModalVisible}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerDark: {
    height: '75%',
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: '75%',
    backgroundColor: 'white',
  },
  campaignText: {
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  bottomContainerDark: {
    backgroundColor: 'black',
  },
  bottomContainerLight: {
    backgroundColor: 'white',
  },
  dividingLine: {
    backgroundColor: 'lightgray',
    height: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  referralAndSpouseText: {
    width: '92%',
    paddingRight: 10,
  },
  directionsRow1: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  priorityText: {
    color: '#F99055',
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  directionsRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
  },
  headerDark: {
    fontSize: 18,
    color: 'white',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: '500',
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 1,
    marginTop: 10,
  },
  link: {
    marginTop: 10,
    marginLeft: 15,
    color: '#02ABF7',
    fontSize: 16,
  },
  regTextDark: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  regTextLight: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
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
  editText: {
    color: 'red',
    //  textAlign: 'center',
    fontSize: 20,
  },
  completeText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 40,
  },
  directionsText: {
    color: '#1398F5',
    fontSize: 16,
    textAlign: 'right',
    marginRight: 10,
    marginTop: 7,
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
