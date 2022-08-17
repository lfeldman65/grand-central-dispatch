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
import { landingPages } from './settingsHelpers';

export default function LandingScreen(props: any) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [landingPage, setLandingPage] = useState(landingPages[0]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Select Landing Page',
      headerRight: () => <Button color="#fff" onPress={savePressed} title="Save" />,
    });
  }, [navigation, landingPage]);

  useEffect(() => {
    getDarkOrLightMode();
    getCurrentLandingPage();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function savePressed() {
    console.log('save pressed landing: ' + landingPage);
    storage.setItem('landingPage', landingPage);
    navigation.goBack();
  }

  async function getCurrentLandingPage() {
    var savedLanding = await storage.getItem('landingPage');
    if (savedLanding != null) {
      setLandingPage(savedLanding);
      console.log('getCurrent: ' + savedLanding);
    } else {
      setLandingPage(landingPages[0]);
      console.log('getCurrent: ' + savedLanding);
    }
  }

  return <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}></View>;
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
});
