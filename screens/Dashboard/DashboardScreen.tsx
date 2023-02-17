import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import * as Notifications from 'expo-notifications';
import { PermissionStatus } from 'expo-modules-core';
import { Notification } from 'expo-notifications';
import { ga4Analytics } from '../../utils/general';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { LogBox } from 'react-native';

const callImage = require('../Dashboard/images/quickCalls.png');
const noteImage = require('../Dashboard/images/quickNotes.png');
const popImage = require('../Dashboard/images/quickPop.png');
const pacImage = require('../Dashboard/images/quickPAC.png');
const relImage = require('../Dashboard/images/quickRel.png');
const goalsImage = require('../Dashboard/images/quickGoals.png');
const transImage = require('../Dashboard/images/quickTrans.png');
const todoImage = require('../Dashboard/images/quickToDo.png');
const calendarImage = require('../Dashboard/images/quickCalendar.png');

var watchedTut = 'false';

interface DashboardNavigationProps {
  parentScreen?: string;
  label: string;
  screen: string;
  params?: any;
  itemID: string;
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [lightOrDark, setLightOrDark] = useState('');
  const isFocused = useIsFocused();

  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED
  );

  function SentryTest() {
    console.log('sentry test');
    Sentry.Native.nativeCrash();
    throw new Error('My first Sentry error!');
    Sentry.Native.captureException(new Error('Oops!'));
  }

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    return status;
  };

  const handleNotification = (notification: Notification) => {
    const { title } = notification.request.content;
    console.warn(title);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    requestNotificationPermissions();
    if (watchedTut == 'true') {
      console.log('HEREA');
      getLandingPage();
    } else {
      console.log('HEREB');
      showTutorial();
    }
  }, []);

  useEffect(() => {
    hasWatchedTutorial();
    LogBox.ignoreAllLogs(true);
  }, [isFocused]);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  async function hasWatchedTutorial() {
    console.log('WATCHEDTUT');
    const localWatched = await storage.getItem('watchedTutorial');
    if (localWatched == null) {
      watchedTut = 'false';
    } else {
      watchedTut = localWatched;
    }
    storage.setItem('watchedTutorial', 'true');
    console.log(watchedTut);
  }

  function navigateToLandingPage(landingPage?: string) {
    console.log('landing page:' + landingPage);
    if (landingPage == 'Priority Action Center') {
      handleNavigation({
        parentScreen: 'PAC',
        screen: 'PAC1',
        params: { defaultTab: 'calls' },
        label: 'Calls Pressed',
        itemID: 'none',
      });
    }
    if (landingPage == 'Goals') {
      handleNavigation({
        screen: 'goals',
        label: 'Goals',
        itemID: 'none',
      });
    }
    if (landingPage == 'Manage Relationships') {
      handleNavigation({
        screen: 'Rolodex',
        label: 'Relationships',
        itemID: 'none',
      });
    }
    if (landingPage == 'Recent Contact Activity') {
      handleNavigation({
        screen: 'RecentActivity',
        label: 'RecentActivity',
        itemID: 'none',
      });
    }
    if (landingPage == 'Video History') {
      handleNavigation({
        screen: 'VideoStack',
        label: 'VideoStack',
        itemID: 'none',
      });
    }
    if (landingPage == 'Real Estate Transactions') {
      handleNavigation({
        screen: 'RETransactionsMenu',
        label: 'RETransactionsMenu',
        itemID: 'none',
      });
    }
    if (landingPage == 'Lender Transactions') {
      handleNavigation({
        screen: 'LenderTransactionsMenu',
        label: 'LenderTransactionsMenu',
        itemID: 'none',
      });
    }
    if (landingPage == 'Other Transactions') {
      handleNavigation({
        screen: 'OtherTransactionsMenu',
        label: 'OtherTransactionsMenu',
        itemID: 'none',
      });
    }
    if (landingPage == 'Pop-By') {
      handleNavigation({
        screen: 'PopBysScreen',
        label: 'PopBysScreen',
        itemID: 'none',
      });
    }
    if (landingPage == 'To-Do') {
      handleNavigation({
        screen: 'To-Do',
        label: 'To-Do',
        itemID: 'none',
      });
    }
    if (landingPage == 'Calendar') {
      handleNavigation({
        screen: 'CalendarScreen',
        label: 'CalendarScreen',
        itemID: 'none',
      });
    }
    if (landingPage == 'Podcasts') {
      handleNavigation({
        screen: 'PodcastsScreen',
        label: 'PodcastsScreen',
        itemID: 'none',
      });
    }
  }

  async function getLandingPage() {
    var savedLanding = await storage.getItem('landingPage');
    if (savedLanding != null) {
      console.log('getCurrent: ' + savedLanding);
      if (savedLanding != 'Dashboard') {
        navigateToLandingPage(savedLanding);
      }
    }
  }

  function showTutorial() {
    handleNavigation({
      screen: 'Tutorial',
      label: 'Tutorial',
      itemID: 'none',
    });
  }

  const handleNavigation = (props: DashboardNavigationProps) => {
    // SentryTest();
    console.log('parent screen1: ' + props.parentScreen);
    var newLabel = props.label;
    if (props.label == 'To-Do') {
      newLabel = 'To_Do';
    }
    if (props.label == 'Pop-Bys') {
      newLabel = 'Pop_Bys';
    }
    const mainEvent = 'Dashboard_' + newLabel;
    console.log('MAINEVENT: ' + mainEvent);
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: props.itemID,
    });
    if (props.parentScreen) {
      navigation.navigate(props.parentScreen, {
        screen: props.screen,
        params: props.params ? props.params : null,
      });
    } else {
      console.log('propsscreen: ' + props.screen);
      props.params ? navigation.navigate(props.screen, { ...props.params }) : navigation.navigate(props.screen);
    }
  };

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>

      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  parentScreen: 'PAC',
                  screen: 'PAC1',
                  params: { defaultTab: 'calls' },
                  label: 'Calls',
                  itemID: 'id0201',
                })
              }
            >
              <Image source={callImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Calls</Text>}
          </View>

          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  parentScreen: 'PAC',
                  screen: 'PAC1',
                  params: { defaultTab: 'notes' },
                  label: 'Notes',
                  itemID: 'id0202',
                })
              }
            >
              <Image source={noteImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Notes</Text>}
          </View>

          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'PopBysScreen',
                  label: 'Pop-Bys',
                  itemID: 'id0203',
                })
              }
            >
              <Image source={popImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Pop-Bys</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  parentScreen: 'PAC',
                  screen: 'PAC1',
                  params: { defaultTab: 'calls' },
                  label: 'PAC',
                  itemID: 'id0204',
                })
              }
            >
              <Image source={pacImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Priority</Text>}
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Action</Text>}
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Center</Text>}
          </View>

          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'Rolodex',
                  label: 'Relationships',
                  itemID: 'id0205',
                })
              }
            >
              <Image source={relImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Relationships</Text>}
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'goals', // doesn't matter?
                  label: 'Goals',
                  itemID: 'id0206',
                })
              }
            >
              <Image source={goalsImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Goals</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'RETransactionsMenu',
                  label: 'Transactions',
                  itemID: 'id0207',
                })
              }
            >
              <Image source={transImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Transactions</Text>}
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'To-Do',
                  label: 'To-Do',
                  itemID: 'id0208',
                })
              }
            >
              <Image source={todoImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>To-Do's</Text>}
          </View>

          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'CalendarScreen',
                  label: 'Calendar',
                  itemID: 'id0209',
                })
              }
            >
              <Image source={calendarImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Calendar</Text>}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  pair: {
    flex: 1,
    marginTop: 20,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5,
  },
  namesDark: {
    color: 'white',
    textAlign: 'center',
    fontSize: 11,
  },
  namesLight: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },
});
