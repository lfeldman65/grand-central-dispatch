import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Moment } from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import AppointmentRow from './AppointmentRow';
import { getAppointments } from './api';
import { AppointmentDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import React from 'react';
import AddAppointmentScreen from './AddAppointmentScreen';
import { getDayNumber, getMonthNumber, getYear } from './calendarHelpers';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const chevronUp = require('../../images/chevron_blue_up.png');
const chevronDown = require('../../images/chevron_blue_down.png');
const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
type MapLength = 'gone' | 'regular';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<AppointmentDataProps[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [calendarHeight, setCalendarHeight] = useState<MapLength>('regular');
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const handleRowPress = (index: number) => {
    ga4Analytics('Calendar_Row', {
      contentType: 'none',
      itemId: 'id1301',
    });
    navigation.navigate('ApptDetails', {
      apptID: data[index].id,
      lightOrDark: lightOrDark,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, lightOrDark]);

  useEffect(() => {
    setLightOrDark('');
    console.log('lightOrDark:' + lightOrDark);
    let isMounted = true;
    var day = getDayNumber(startDate.toString());
    var month = getMonthNumber(startDate.toString());
    var year = getYear(startDate.toString());
    console.log('day: ' + day);
    console.log('MONTH2112: ' + month);
    console.log('YEAR: ' + year);
    fetchAppointments('00', month, year, isMounted); // day = '00' returns every day in month and year
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  }

  function addAppointmentPressed() {
    ga4Analytics('Calendar_Add_Appointment', {
      contentType: 'none',
      itemId: 'id1302',
    });
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

  function handleMonthChange(date: Moment) {
    console.log('next or previous pressed: ' + date);
    let month = getMonthNumber(date.toString());
    let year = getYear(date.toString());
    let day = getDayNumber(date.toString());
    console.log(month + ' ' + day + ' ' + year);
    fetchAppointments('00', month, year, true);
  }

  function upPressed() {
    if (calendarHeight == 'regular') {
      setCalendarHeight('gone');
    }
  }

  function downPressed() {
    if (calendarHeight == 'gone') {
      setCalendarHeight('regular');
    }
  }

  function getUpArrowStyle() {
    if (calendarHeight == 'gone') return styles.upAndDownButtonsDim;
    return styles.upAndDownButtons;
  }

  function getDownArrowStyle() {
    if (calendarHeight == 'regular') return styles.upAndDownButtonsDim;
    return styles.upAndDownButtons;
  }

  function getcalendarHeight() {
    if (calendarHeight == 'gone') {
      return styles.calendarViewGone;
    }
    if (calendarHeight == 'regular') {
      return styles.calendarViewRegular;
    }
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <View style={getcalendarHeight()}>
          {lightOrDark != '' && calendarHeight == 'regular' && (
            <CalendarPicker
              todayBackgroundColor="#02ABF7"
              todayTextStyle={styles.todayText}
              selectedDayColor="gray"
              selectedDayTextColor="white"
              textStyle={lightOrDark == 'dark' ? styles.calendarTextDark : styles.calendarTextLight}
              onDateChange={onDateChange}
              onMonthChange={handleMonthChange}
              nextTitleStyle={styles.nextButton}
              previousTitleStyle={styles.nextButton}
              monthTitleStyle={styles.monthText}
              yearTitleStyle={styles.yearText}
              //   showDayStragglers={true}
            />
          )}
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        ) : (
          <React.Fragment>
            <View style={styles.upAndDownRow}>
              <TouchableOpacity style={styles.chevronView} onPress={upPressed}>
                <View>
                  <Image source={chevronUp} style={getUpArrowStyle()} />
                </View>
              </TouchableOpacity>
              <View style={lightOrDark == 'dark' ? styles.infoViewDark : styles.infoViewLight}>
                <Text style={lightOrDark == 'dark' ? styles.infoTextDark : styles.infoTextLight}>Appointments</Text>
              </View>
              <TouchableOpacity style={styles.chevronView} onPress={downPressed}>
                <View>
                  <Image source={chevronDown} style={getDownArrowStyle()} />
                </View>
              </TouchableOpacity>
            </View>
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
        {quickSearchVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={quickSearchVisible}
            onRequestClose={() => {
              setQuickSearchVisible(!quickSearchVisible);
            }}
          >
            <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
          </Modal>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  upAndDownRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.25,
  },
  chevronView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upAndDownButtons: {
    width: 25,
    height: 15,
    opacity: 1.0,
  },
  upAndDownButtonsDim: {
    width: 25,
    height: 15,
    opacity: 0.4,
  },
  infoViewDark: {
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoViewLight: {
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextDark: {
    color: 'white',
    paddingTop: 4,
    fontSize: 16,
  },
  infoTextLight: {
    color: 'black',
    paddingTop: 4,
    fontSize: 16,
  },
  calendarViewRegular: {
    height: '47%',
    width: '100%',
  },
  calendarViewGone: {
    height: '0%',
    width: '100%',
  },
  todayText: {
    color: 'white',
  },
  monthText: {
    marginLeft: -20,
    marginTop: 7,
  },
  yearText: {
    marginTop: 7,
  },
  nextButton: {
    marginTop: 7,
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
