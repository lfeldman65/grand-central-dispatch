import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { getToDoDetails, markCompleteToDo, deleteToDo } from './api';
import { ToDoDetailsDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import { prettyDate, isNullOrEmpty } from '../../utils/general';
import openMap from 'react-native-open-maps';

let deviceHeight = Dimensions.get('window').height;

export default function ToDoDetails(props: any) {
  const navigation = useNavigation();
  const { route } = props;
  const { toDoID } = route.params;
  const isFocused = useIsFocused();
  const [data, setdata] = useState<ToDoDetailsDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function deletePressed() {
    console.log('delete pressed');
  }

  function handleDirectionsPressed() {
    console.log('directions pressed');
    openMap({ query: data?.location });
  }

  function handleAttendeePressed(index: number) {
    console.log('attendee pressed: ' + index);
    navigation.navigate('RelDetails', {
      contactId: data?.attendees[index].id,
      firstName: data?.attendees[index].name,
      lastName: '',
    });
  }

  function fetchData() {
    setIsLoading(true);
    getToDoDetails(toDoID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setdata(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function markComplete() {
    console.log('mark complete or close');
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={lightOrDark == 'dark' ? styles.topContainerDark : styles.topContainerLight}>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>{data?.title}</Text>
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
            <TouchableOpacity onPress={() => handleAttendeePressed(index)}>
              <Text style={styles.link}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={lightOrDark == 'dark' ? styles.bottomContainerDark : styles.bottomContainerLight}>
        {data?.isCampaign && (
          <Text style={lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
            This To-Do is part of a marketing campaign
          </Text>
        )}
        {data?.isCampaign && <Text></Text>}

        <TouchableOpacity onPress={markComplete}>
          <Text style={styles.completeText}>{data?.isCampaign ? 'Close' : 'Mark as Complete'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainerDark: {
    height: 0.72 * deviceHeight,
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: 0.72 * deviceHeight,
    backgroundColor: 'white',
  },
  bottomContainerDark: {
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  bottomContainerLight: {
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  dividingLine: {
    backgroundColor: 'lightgray',
    height: 1,
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
});
