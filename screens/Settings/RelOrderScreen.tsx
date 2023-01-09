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
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { displayAZRows } from './settingsHelpers';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

export default function RelOrderScreen(props: any) {
  const [lightOrDark, setLightOrDark] = useState('');
  const [displayAZ, setDisplayAZ] = useState('First Last');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Display Relationships A - Z',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, displayAZ]);

  useEffect(() => {
    let isMounted = true;
    getCurrentDisplayAZ(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function savePressed() {
    console.log('save pressed display: ' + displayAZ);
    storage.setItem('displayAZ', displayAZ);
    navigation.goBack();
  }

  async function getCurrentDisplayAZ(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var savedDisplay = await storage.getItem('displayAZ');
    if (savedDisplay != null) {
      setDisplayAZ(savedDisplay);
      console.log('getCurrent: ' + savedDisplay);
    } else {
      setDisplayAZ('First Last');
      console.log('getCurrent: ' + savedDisplay);
    }
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        {displayAZRows.map((item, index) => (
          <View key={index} style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
            <Text style={lightOrDark == 'dark' ? styles.rowTitleDark : styles.rowTitleLight}>
              {displayAZRows[index]}
            </Text>
            <View style={styles.checkView}>
              <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
                size={25}
                textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
                fillColor="#37C0FF"
                unfillColor="white"
                iconStyle={{ borderColor: 'gray' }}
                text=""
                textContainerStyle={{ marginLeft: 10 }}
                disableBuiltInState={true}
                isChecked={displayAZ == displayAZRows[index]}
                onPress={(isChecked: boolean) => {
                  setDisplayAZ(displayAZRows[index]);
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
