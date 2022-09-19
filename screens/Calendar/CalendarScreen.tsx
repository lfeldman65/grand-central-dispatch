import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
//import AppointmentRow from './AppointmentRow';
import { getAppointments } from './api';
import { AppointmentDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { storage } from '../../utils/storage';
// import AddAppointmentScreen from './AddAppointment';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AppointmentDataProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (index: number) => {
    console.log('appointment row press');
    //  analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    navigation.navigate('ApptDetails', {
      apptID: data[index].id,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
    getDarkOrLightMode();
    fetchAppointments('9', '2022');
  }, [isFocused]);

  function addAppointmentPressed() {
    setModalVisible(true);
  }

  function fetchAppointments(month: string, year: string) {
    setIsLoading(true);
    getAppointments(month, year)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function saveComplete() {
    fetchAppointments('9', '2022');
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={styles.calendarView}></View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            <View>
              {/* {data.map((item, index) => (
                <AppointmentRow appID={item.id} key={index} data={item} onPress={() => handleRowPress(index)} />
              ))} */}
            </View>
          </ScrollView>
        </React.Fragment>
      )}
      <TouchableOpacity style={styles.bottomContainer} onPress={() => addAppointmentPressed()}>
        <View style={styles.addButton}>
          <Text style={styles.addText}>{'Add Appointment'}</Text>
        </View>
      </TouchableOpacity>
      {/* {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <AddAppointmentScreen title={'New Appointment'} onSave={saveComplete} setModalVisible={setModalVisible} />
        </Modal>
      )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  calendarView: {
    height: '50%',
    width: '100%',
    backgroundColor: 'red',
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  addText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    // justifyContent: 'center',
    marginBottom: 12,
  },
});
