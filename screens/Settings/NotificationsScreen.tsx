import { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { notificationRowsWithVid, notificationRowsNoVid } from './settingsHelpers';

export default function NotificationsScreen(props: any) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [notifCall, setNotifCall] = useState(true);
  const [notifToDo, setNotifToDo] = useState(true);
  const [notifWins, setNotifWins] = useState(true);
  const [notifPopBys, setNotifPopBys] = useState(true);
  const [notifImport, setNotifImport] = useState(true);
  const [notifVideos, setNotifVideos] = useState(true);
  const [hasBombBomb, setHasBombBomb] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, notifCall, notifToDo, notifWins, notifPopBys, notifImport, notifVideos]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [[navigation, notifCall, notifToDo, notifWins, notifPopBys, notifImport, notifVideos]]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getCurrentNotifs(isMounted);
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

  function savePressed() {
    var state = 'False';
    if (notifCall) {
      state = 'True';
    }
    storage.setItem('notifCall', state);
    console.log('save: ' + state);

    state = 'False';
    if (notifToDo) {
      state = 'True';
    }
    storage.setItem('notifToDo', state);

    state = 'False';
    if (notifWins) {
      state = 'True';
    }
    storage.setItem('notifWins', state);

    state = 'False';
    if (notifPopBys) {
      state = 'True';
    }
    storage.setItem('notifPopBys', state);

    state = 'False';
    if (notifImport) {
      state = 'True';
    }
    storage.setItem('notifImport', state);

    state = 'False';
    if (notifVideos) {
      state = 'True';
    }
    storage.setItem('notifVideos', state);

    navigation.goBack();
  }

  function handleCheck(index: number) {
    console.log('handle check index: ' + index);
    if (index == 0) {
      setNotifCall(!notifCall);
      console.log('handle check: ' + notifCall);
    }
    if (index == 1) {
      setNotifToDo(!notifToDo);
    }
    if (index == 2) {
      setNotifWins(!notifWins);
    }
    if (index == 3) {
      setNotifPopBys(!notifPopBys);
    }
    if (index == 4) {
      setNotifImport(!notifImport);
    }
    if (index == 5) {
      setNotifVideos(!notifVideos);
    }
  }

  function isNotifChecked(index: number) {
    if (index == 0) {
      return notifCall;
    }
    if (index == 1) {
      return notifToDo;
    }
    if (index == 2) {
      return notifWins;
    }
    if (index == 3) {
      return notifPopBys;
    }
    if (index == 4) {
      return notifImport;
    }
    if (index == 5) {
      return notifVideos;
    }
  }

  function selectAllPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Near Me', 0));
    console.log('select all pressed');
    setNotifCall(true);
    setNotifToDo(true);
    setNotifWins(true);
    setNotifPopBys(true);
    setNotifImport(true);
    setNotifVideos(true);
  }

  function deselectAllPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Near Me', 0));
    setNotifCall(false);
    setNotifToDo(false);
    setNotifWins(false);
    setNotifPopBys(false);
    setNotifImport(false);
    setNotifVideos(false);
  }

  async function getCurrentNotifs(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var saved = await storage.getItem('notifCall');
    if (saved == null || saved == 'True') {
      setNotifCall(true);
    } else {
      setNotifCall(false);
    }

    saved = await storage.getItem('notifToDo');
    if (saved == null || saved == 'True') {
      setNotifToDo(true);
    } else {
      setNotifToDo(false);
    }

    saved = await storage.getItem('notifWins');
    if (saved == null || saved == 'True') {
      setNotifWins(true);
    } else {
      setNotifWins(false);
    }

    saved = await storage.getItem('notifPopBys');
    if (saved == null || saved == 'True') {
      setNotifPopBys(true);
    } else {
      setNotifPopBys(false);
    }

    saved = await storage.getItem('notifImport');
    if (saved == null || saved == 'True') {
      setNotifImport(true);
    } else {
      setNotifImport(false);
    }

    saved = await storage.getItem('notifVideos');
    if (saved == null || saved == 'True') {
      setNotifVideos(true);
    } else {
      setNotifVideos(false);
    }

    saved = await storage.getItem('hasBombBomb');
    if (saved == null || saved == 'true') {
      setHasBombBomb(true);
    } else {
      setHasBombBomb(true);
    }
    if (hasBombBomb) {
      console.log('has bb: ' + hasBombBomb);
    }
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={globalStyles.tabButtonRow}>
        <Text style={styles.selected} onPress={selectAllPressed}>
          Select All
        </Text>
        <Text style={styles.selected} onPress={deselectAllPressed}>
          Deselect All
        </Text>
      </View>
      {hasBombBomb &&
        notificationRowsWithVid.map((item, index) => (
          <View key={index} style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
            <Text style={lightOrDark == 'dark' ? styles.rowTitleDark : styles.rowTitleLight}>
              {notificationRowsWithVid[index]}
            </Text>
            <View style={styles.checkView}>
              <BouncyCheckbox
                size={25}
                textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
                fillColor="#37C0FF"
                unfillColor="white"
                iconStyle={{ borderColor: 'gray' }}
                text=""
                textContainerStyle={{ marginLeft: 10 }}
                disableBuiltInState={true}
                isChecked={isNotifChecked(index)}
                onPress={(isChecked: boolean) => {
                  console.log('isChecked: ' + isChecked);
                  console.log('index: ' + index);
                  handleCheck(index);
                }}
              />
            </View>
          </View>
        ))}

      {!hasBombBomb &&
        notificationRowsNoVid.map((item, index) => (
          <View key={index} style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
            <Text style={lightOrDark == 'dark' ? styles.rowTitleDark : styles.rowTitleLight}>
              {notificationRowsNoVid[index]}
            </Text>
            <View style={styles.checkView}>
              <BouncyCheckbox
                size={25}
                textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
                fillColor="#37C0FF"
                unfillColor="white"
                iconStyle={{ borderColor: 'gray' }}
                text=""
                textContainerStyle={{ marginLeft: 10 }}
                disableBuiltInState={true}
                isChecked={isNotifChecked(index)}
                onPress={(isChecked: boolean) => {
                  console.log('isChecked: ' + isChecked);
                  console.log('index: ' + index);
                  handleCheck(index);
                }}
              />
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: 10,
    // backgroundColor: '#00AAAA'
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  checkView: {
    marginTop: 12,
    left: '90%',
    position: 'absolute',
    marginBottom: 12,
  },
  rowTitleDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rowTitleLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 11,
    borderColor: 'lightblue',
    borderWidth: 1,
  },
});
