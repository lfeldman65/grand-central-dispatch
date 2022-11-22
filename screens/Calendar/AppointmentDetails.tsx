import { useState } from 'react';
import { StyleSheet, Modal, Button, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { getAppointmentDetails } from './api';
import { deleteToDo } from '../ToDo/api'; // Don't let the name fool you. Deletes To-Do's and Appointments.
import { AppointmentDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import { prettyDate, isNullOrEmpty, prettyTime } from '../../utils/general';
import openMap from 'react-native-open-maps';
import * as React from 'react';
import EditAppointment from './EditAppointmentScreen';

export default function AppointmentDetails(props: any) {
  const navigation = useNavigation();
  const { route } = props;
  const { apptID } = route.params;
  const isFocused = useIsFocused();
  const [apptData, setApptData] = useState<AppointmentDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={editPressed}>
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function editPressed() {
    console.log('edit pressed');
    setModalVisible(true);
  }

  function fetchData(isMounted: boolean) {
    setIsLoading(true);
    getAppointmentDetails(apptID)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setApptData(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function deletePressed() {
    console.log('delete pressed');
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
    deleteToDo(apptID)
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
    openMap({ query: apptData?.location });
  }

  function handleAttendeePressed(attendeeID: string) {
    console.log('attendee pressed: ' + attendeeID);
    navigation.navigate('RelDetails', {
      contactId: apptData?.attendees[0].id,
      firstName: apptData?.attendees[0].name,
      lastName: '',
    });
  }

  function saveComplete() {
    console.log('save complete');
    //  fetchData();
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={lightOrDark == 'dark' ? styles.topContainerDark : styles.topContainerLight}>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>{apptData?.title}</Text>
        <View style={styles.dividingLine}></View>

        <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
          {'Start Time: ' +
            new Date(apptData?.startTime!).toLocaleDateString() +
            ' ' +
            new Date(apptData?.startTime!).toLocaleTimeString()}
        </Text>

        <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
          {'End Time: ' +
            new Date(apptData?.endTime!).toLocaleDateString() +
            ' ' +
            new Date(apptData?.endTime!).toLocaleTimeString()}
        </Text>

        {!isNullOrEmpty(apptData?.location) && (
          <View style={styles.directionsRow}>
            <Text style={styles.sectionHeader}>Location</Text>
            <TouchableOpacity onPress={() => handleDirectionsPressed()}>
              <Text style={styles.directionsText}>{'Directions'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isNullOrEmpty(apptData?.location) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{apptData?.location!}</Text>
        )}

        {!isNullOrEmpty(apptData?.notes) && <Text style={styles.sectionHeader}>Notes</Text>}
        {!isNullOrEmpty(apptData?.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>{apptData?.notes!}</Text>
        )}

        {!isNullOrEmpty(apptData?.attendees) && <Text style={styles.sectionHeader}>Attendees</Text>}

        {!isNullOrEmpty(apptData?.attendees) &&
          apptData?.attendees.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleAttendeePressed(item.id)}>
              <Text style={styles.link}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={lightOrDark == 'dark' ? styles.bottomContainerDark : styles.bottomContainerLight}>
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
          <EditAppointment
            title={'Edit Appointment'}
            apptID={apptData?.id}
            titleFromParent={apptData?.title}
            startDateFromParent={apptData?.startTime}
            toDateFromParent={apptData?.endTime}
            locationFromParent={apptData?.location}
            attendeeFromParent={apptData?.attendees ?? []}
            notesFromParent={apptData?.notes}
            onSave={saveComplete}
            setModalVisible={setModalVisible}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerDark: {
    height: '90%',
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: '90%',
    backgroundColor: 'white',
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
    marginBottom: 10,
    fontWeight: '500',
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
    marginTop: 10,
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
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
  editText: {
    color: 'red',
    fontSize: 20,
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
