import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import * as Notifications from 'expo-notifications';
import { PermissionStatus } from 'expo-modules-core';
import { Notification } from 'expo-notifications';
import { ga4Analytics, shouldRunTests } from '../../utils/general';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import { getNotificationStatus } from '../../utils/general';
import { goalTests } from '../Goals/testGoals';
import { pacTestComplete } from '../PAC/testPACComplete';
import { pacTestPostpone } from '../PAC/testPACPostpone';
import { testAddRelationship } from '../Relationships/testAddRelationship';
import { testAddRelationshipToGroup } from '../Relationships/testAddRelToGroup';
import { testRemoveRelationshipFromGroup } from '../Relationships/testRemoveRelFromGroup';
import { testAddTransaction } from '../Transactions/testAddTransaction';
import { testAddToDo } from '../ToDo/testAddToDo';
import { testDeleteToDo } from '../ToDo/testDeleteToDo';
import { testAddAppointment } from '../Calendar/testAddNewAppointment';
import { testDeleteAppointment } from '../Calendar/testDeleteAppointment';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
const callImage = require('../Dashboard/images/quickCalls.png');
const noteImage = require('../Dashboard/images/quickNotes.png');
const popImage = require('../Dashboard/images/quickPop.png');
const pacImage = require('../Dashboard/images/quickPAC.png');
const relImage = require('../Dashboard/images/quickRel.png');
const goalsImage = require('../Dashboard/images/quickGoals.png');
const transImage = require('../Dashboard/images/quickTrans.png');
const todoImage = require('../Dashboard/images/quickToDo.png');
const calendarImage = require('../Dashboard/images/quickCalendar.png');
const testImage = require('../Dashboard/images/testing.png');

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
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED
  );

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

  function SentryTest() {
    console.log('sentry test');
    Sentry.Native.nativeCrash();
    throw new Error('My first Sentry error!');
    Sentry.Native.captureException(new Error('Oops!'));
  }

  async function hasImportNotifications() {
    var notif = await getNotificationStatus('notifImport');
    if (notif == null) {
      return false;
    }
    if (!notif) {
      return false;
    }
    return true;
  }

  const requestNotificationPermissions = async () => {
    // runs in background or killed
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    if (await hasImportNotifications()) {
      const importNotif = await Notifications.scheduleNotificationAsync({
        identifier: 'import-notification',
        content: {
          title: `Reminder`,
          subtitle: '',
          body: `Would you like to see if there are any new relationships to import?`,
          sound: true,
          data: {
            id: 'import-notification',
          },
          color: '#000000',
        },
        trigger: {
          day: 1,
          hour: 15,
          minute: 0,
          //   second: 0,
          repeats: true,
        },
      });
      //  console.log('notif id:' + importNotif);
      return status;
    }
  };

  const handleNotification = (notification: Notification) => {
    const { title } = notification.request.content;
    console.warn(title);
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
  });

  useEffect(() => {
    console.log('useEffect');
    requestNotificationPermissions();
    console.log('response from tap');
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      var id = response.notification.request.content.data.id;
      console.log(typeof id);
      console.log('id:' + id);
      if (id == 'import-notification') {
        ga4Analytics('Notification_Import', {
          contentType: 'none',
          itemId: 'id1600',
        });
        navigation.navigate('SettingsScreenNav', {
          screen: 'ImportStackNavigator',
        });
      } else if (id == 'win-notification') {
        ga4Analytics('Notification_Win', {
          contentType: 'none',
          itemId: 'id1601',
        });
        navigation.navigate('goals');
      } else if (id == 'video-notification') {
        ga4Analytics('Notification_Video', {
          contentType: 'none',
          itemId: 'id1602',
        });
        navigation.navigate('VideoStack', {
          screen: 'VideoHistoryScreen',
        });
      } else if (id == 'popby-notification') {
        ga4Analytics('Notification_Pop_By', {
          contentType: 'none',
          itemId: 'id1603',
        });
        navigation.navigate('PopBysScreen');
      } else if (id == 'pac-notification-1') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'pac-notification-2') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'pac-notification-3') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'pac-notification-4') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'pac-notification-5') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'pac-notification-6') {
        ga4Analytics('Notification_Pac', {
          contentType: 'none',
          itemId: 'id1604',
        });
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
      } else if (id == 'todo-notification-2') {
        ga4Analytics('Notification_To_Do', {
          contentType: 'none',
          itemId: 'id1605',
        });
        navigation.navigate('To-Do');
      } else if (id == 'todo-notification-3') {
        ga4Analytics('Notification_To_Do', {
          contentType: 'none',
          itemId: 'id1605',
        });
        navigation.navigate('To-Do');
      } else if (id == 'todo-notification-4') {
        ga4Analytics('Notification_To_Do', {
          contentType: 'none',
          itemId: 'id1605',
        });
        navigation.navigate('To-Do');
      } else if (id == 'todo-notification-5') {
        ga4Analytics('Notification_To_Do', {
          contentType: 'none',
          itemId: 'id1605',
        });
        navigation.navigate('To-Do');
      } else if (id == 'todo-notification-6') {
        ga4Analytics('Notification_To_Do', {
          contentType: 'none',
          itemId: 'id1605',
        });
        navigation.navigate('To-Do');
      } else {
        console.log('other notif');
      }
    });
    if (watchedTut == 'true') {
      getLandingPage();
    } else {
      showTutorial();
    }
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    hasWatchedTutorial();
    if (shouldRunTests()) {
      runTests();
      return;
    }
  }, [isFocused]);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  function runTests() {
    //  goalTests();
    //  pacTestComplete(); // only one pac test at a time
    // pacTestPostpone();
    // testAddRelationship();
    //testAddRelationshipToGroup();
    //testRemoveRelationshipFromGroup();
    //  testAddTransaction();
    //  testAddToDo(); //
    //  testDeleteToDo(); // fail
    //testAddAppointment();
    //testDeleteAppointment();
    return;
  }

  async function hasWatchedTutorial() {
    const localWatched = await storage.getItem('watchedTutorial');
    if (localWatched == null) {
      watchedTut = 'false';
    } else {
      watchedTut = localWatched;
    }
    storage.setItem('watchedTutorial', 'true');
  }

  function navigateToLandingPage(landingPage?: string) {
    // console.log('landing page:' + landingPage);
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
      //  console.log('getCurrent: ' + savedLanding);
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
    //   console.log('parent screen1: ' + props.parentScreen);
    var newLabel = props.label;
    if (props.label == 'To-Do') {
      newLabel = 'To_Do';
    }
    if (props.label == 'Pop-Bys') {
      newLabel = 'Pop_Bys';
    }
    const mainEvent = 'Dashboard_' + newLabel;
    //   console.log('MAINEVENT: ' + mainEvent);
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: props.itemID,
    });
    if (props.parentScreen) {
      navigation.navigate(props.parentScreen, {
        screen: props.screen,
        params: props.params ? props.params : null,
        animationEnabled: false,
      });
    } else {
      // console.log('propsscreen: ' + props.screen);
      props.params
        ? navigation.navigate(props.screen, { ...props.params, animationEnabled: false })
        : navigation.navigate(props.screen, { animationEnabled: false });
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
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>To Dos</Text>}
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
