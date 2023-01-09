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

import { Moment, MomentInput } from 'moment';
import CalendarPicker, { DateChangedCallback } from 'react-native-calendar-picker';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import AppointmentRow from './AppointmentRow';
import { getAppointments } from './api';
import { AppointmentDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import React from 'react';
import { storage } from '../../utils/storage';
import AddAppointmentScreen from './AddAppointmentScreen';
import { getDayNumber, getMonthNumber, getYear } from './calendarHelpers';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AppointmentDataProps[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');

  const handleRowPress = (index: number) => {
    console.log('appointment row press');
    //  analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    navigation.navigate('ApptDetails', {
      apptID: data[index].id,
      lightOrDark: lightOrDark,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation, lightOrDark]);

  useEffect(() => {
    let isMounted = true;
    var day = getDayNumber(startDate.toString());
    var month = getMonthNumber(startDate.toString());
    var year = getYear(startDate.toString());
    console.log('MONTH2112: ' + month);
    console.log('YEAR: ' + year);
    fetchAppointments(day, month, year, isMounted); // '00' returns every day in month
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function addAppointmentPressed() {
    setModalVisible(true);
  }

  function fetchAppointments(day: string, month: string, year: string, isMounted: boolean) {
    setIsLoading(true);
    getAppointments(day, month, year)
      .then((res) => {
        if (!isMounted) {
          return;
        }
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
    console.log('SAVECOMPLETE');
    var day = getDayNumber(startDate.toString());
    var month = getMonthNumber(startDate.toString());
    var year = getYear(startDate.toString());
    console.log('MONTH2112: ' + month);
    console.log('YEAR: ' + year);
    fetchAppointments(day, month, year, true); // '00' returns every day in month
  }

  function onDateChange(date: Moment, type: 'START_DATE' | 'END_DATE') {
    console.log('calendar date: ' + date.toString());
    console.log('start date: ' + type);
    let month = getMonthNumber(date.toString());
    let year = getYear(date.toString());
    let day = getDayNumber(date.toString());
    fetchAppointments(day, month, year, true);
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <View style={styles.calendarView}>
          <CalendarPicker
            todayBackgroundColor="#02ABF7"
            todayTextStyle={styles.todayText}
            selectedDayColor="gray"
            selectedDayTextColor="white"
            textStyle={lightOrDark == 'dark' ? styles.calendarTextDark : styles.calendarTextLight}
            onDateChange={onDateChange}
          />
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        ) : (
          <React.Fragment>
            <ScrollView>
              <View>
                {data.map((item, index) => (
                  <AppointmentRow
                    appID={item.id}
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            </ScrollView>
          </React.Fragment>
        )}
        <TouchableOpacity style={styles.bottomContainer} onPress={() => addAppointmentPressed()}>
          <View style={styles.addButton}>
            <Text style={styles.addText}>{'Add Appointment'}</Text>
          </View>
        </TouchableOpacity>
        {modalVisible && (
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
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  calendarView: {
    height: '40%',
    width: '100%',
  },
  todayText: {
    color: 'white',
  },
  calendarTextDark: {
    color: 'white',
  },
  calendarTextLight: {
    color: 'black',
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
