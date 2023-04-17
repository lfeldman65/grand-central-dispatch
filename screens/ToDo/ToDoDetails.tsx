import { useState } from 'react';
import { StyleSheet, Modal, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { getToDoDetails, markCompleteToDo, deleteToDo } from './api';
import { ToDoDetailsDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { prettyDate, isNullOrEmpty, ga4Analytics } from '../../utils/general';
import openMap from 'react-native-open-maps';
import * as React from 'react';
import EditToDo from './EditToDoScreen';
import { getGoalDataConcise } from '../Goals/api';
import { GoalDataConciseProps } from '../Goals/interfaces';

export default function ToDoDetails(props: any) {
  const navigation = useNavigation();
  const { route } = props;
  const { toDoID, lightOrDark } = route.params;
  const isFocused = useIsFocused();
  const [data, setdata] = useState<ToDoDetailsDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalList, setGoalList] = useState<GoalDataConciseProps[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    fetchGoalList(true);
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
      'Are you sure you want to delete this To-Do?',
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
    console.log('delete pressed');
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
    openMap({ query: data?.location });
  }

  function handleAttendeePressed(attendeeID: string) {
    console.log('attendee pressed: ' + attendeeID);
    navigation.navigate('RelDetails', {
      contactId: data?.attendees[0].id,
      firstName: data?.attendees[0].name,
      lastName: '',
      lightOrDark: lightOrDark,
    });
  }

  function saveComplete() {
    console.log('save complete');
    fetchData(true);
  }

  function fetchGoalList(isMounted: boolean) {
    console.log('fetch goals');
    getGoalDataConcise()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          setGoalList(res.data);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function goalIDToTitle(id: number) {
    if (id == null || id == 0) {
      return 'None';
    }
    console.log('id: ' + id);
    console.log('goallistlength: ' + goalList.length);
    for (var i = 0; i < goalList.length; i++) {
      if (goalList[i].id == id) {
        console.log('i=: ' + i);
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
          setdata(res.data);
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
    if (data?.isCampaign) {
      navigation.goBack();
      return;
    }
    setIsLoading(true);
    markCompleteToDo(toDoID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={lightOrDark == 'dark' ? styles.topContainerDark : styles.topContainerLight}>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>{data?.title}</Text>
        {goalIDToTitle(data?.activityTypeId!) != 'None' && (
          <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>
            {goalIDToTitle(data?.activityTypeId!)}
          </Text>
        )}
        <View style={styles.dividingLine}></View>

        <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
          {'Due: ' + prettyDate(data?.dueDate!)}
        </Text>

        {data?.priority == 'True' && <Text style={styles.priorityText}>{'High Priority'}</Text>}

        {!isNullOrEmpty(data?.location) && (
          <View style={styles.directionsRow}>
            <Text style={styles.sectionHeader}>Location</Text>
            <TouchableOpacity onPress={() => handleDirectionsPressed()}>
              <Text style={styles.directionsText}>{'Directions'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isNullOrEmpty(data?.location) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{data?.location!}</Text>
        )}

        {!isNullOrEmpty(data?.notes) && <Text style={styles.sectionHeader}>Notes</Text>}
        {!isNullOrEmpty(data?.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{data?.notes!}</Text>
        )}

        {!isNullOrEmpty(data?.attendees) && <Text style={styles.sectionHeader}>Attendees</Text>}

        {!isNullOrEmpty(data?.attendees) &&
          data?.attendees.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleAttendeePressed(item.id)}>
              <Text style={styles.link}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={lightOrDark == 'dark' ? styles.bottomContainerDark : styles.bottomContainerLight}>
        <Text style={styles.campaignText}>{data?.isCampaign ? 'This To-Do is part of a marketing campaign' : ''}</Text>
        <TouchableOpacity onPress={markComplete}>
          <Text style={styles.completeText}>{data?.isCampaign ? 'Close' : 'Complete'}</Text>
        </TouchableOpacity>
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
            todoID={data?.id}
            activityTypeId={data?.activityTypeId}
            activityTypeTitle={goalIDToTitle(data?.activityTypeId!)}
            titleFromParent={data?.title}
            dateFromParent={data?.dueDate}
            priorityFromParent={data?.priority}
            locationFromParent={data?.location}
            attendeeFromParent={data?.attendees ?? []}
            notesFromParent={data?.notes}
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
    height: '82%',
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: '82%',
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
    marginTop: 10,
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
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
    marginTop: 5,
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
    marginBottom: 20,
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
