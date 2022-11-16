import { StyleSheet, Text, View, Image, TouchableOpacity, useColorScheme } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState, useRef } from 'react';
import { Event } from 'expo-analytics';
import * as Sentry from 'sentry-expo';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import { storage } from '../../utils/storage';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { Appearance } from 'react-native';

const callImage = require('../Dashboard/images/quickCalls.png');
const noteImage = require('../Dashboard/images/quickNotes.png');
const popImage = require('../Dashboard/images/quickPop.png');
const pacImage = require('../Dashboard/images/quickPAC.png');
const relImage = require('../Dashboard/images/quickRel.png');
const goalsImage = require('../Dashboard/images/quickGoals.png');
const transImage = require('../Dashboard/images/quickTrans.png');
const todoImage = require('../Dashboard/images/quickToDo.png');
const calendarImage = require('../Dashboard/images/quickCalendar.png');

//const analytics = new Analytics('UA-65596113-1');
/*analytics.hit(new PageHit('Home'))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message)); */

interface DashboardNavigationProps {
  parentScreen?: string;
  label: string;
  screen: string;
  params?: any;
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [lightOrDark, setLightOrDark] = useState('');
  const isFocused = useIsFocused();
  var lightOrDarkLocal = 'automatic';

  function SentryTest() {
    console.log('sentry test');
    Sentry.Native.nativeCrash();
    throw new Error('My first Sentry error!');
    Sentry.Native.captureException(new Error('Oops!'));
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    console.log('dashboard screen use effect');
    getLandingPage();
  }, []);

  useEffect(() => {
    console.log('dashboard screen ISFOCUSED use effect');

    console.log('useEffect in DarkOrLight');
    getDarkOrLightMode();
    Appearance.addChangeListener(onThemeChange);
    return () => {
      Appearance.removeChangeListener(onThemeChange);
    };
  }, [isFocused]);

  const onThemeChange = ({ colorScheme }) => {
    console.log('onThemeChange', colorScheme);
    console.log('lightOrDarkLocal ' + lightOrDarkLocal);

    if (lightOrDarkLocal == 'automatic') {
      setLightOrDark(colorScheme);
    } else {
      setLightOrDark(lightOrDarkLocal);
    }
  };

  async function getDarkOrLightMode() {
    var d = await storage.getItem('darkOrLight');
    if (d == null || d == undefined || d == 'automatic') {
      console.log('THEME: ' + d);
      var dd = Appearance.getColorScheme();
      console.log('APPEARANCE: ' + dd);
      lightOrDarkLocal = 'automatic';
      setLightOrDark(dd ?? 'light');
    } else {
      lightOrDarkLocal = d;
      setLightOrDark(d);
    }
  }

  function navigateToLandingPage(landingPage?: string) {
    console.log('landing page:' + landingPage);
    if (landingPage == 'Priority Action Center') {
      handleNavigation({
        parentScreen: 'PAC',
        screen: 'PAC1',
        params: { defaultTab: 'calls' },
        label: 'Calls Pressed',
      });
    }
    if (landingPage == 'Goals') {
      handleNavigation({
        screen: 'goals',
        label: 'Goals',
      });
    }
    if (landingPage == 'Manage Relationships') {
      handleNavigation({
        screen: 'Rolodex',
        label: 'Relationships',
      });
    }
    if (landingPage == 'Recent Contact Activity') {
      handleNavigation({
        screen: 'RecentActivity',
        label: 'RecentActivity',
      });
    }
    if (landingPage == 'Video History') {
      handleNavigation({
        screen: 'VideoStack',
        label: 'VideoStack',
      });
    }
    if (landingPage == 'Real Estate Transactions') {
      handleNavigation({
        screen: 'RETransactionsMenu',
        label: 'RETransactionsMenu',
      });
    }
    if (landingPage == 'Lender Transactions') {
      handleNavigation({
        screen: 'LenderTransactionsMenu',
        label: 'LenderTransactionsMenu',
      });
    }
    if (landingPage == 'Other Transactions') {
      handleNavigation({
        screen: 'OtherTransactionsMenu',
        label: 'OtherTransactionsMenu',
      });
    }
    if (landingPage == 'Pop-By') {
      handleNavigation({
        screen: 'PopBysScreen',
        label: 'PopBysScreen',
      });
    }
    if (landingPage == 'To-Do') {
      handleNavigation({
        screen: 'To-Do',
        label: 'To-Do',
      });
    }
    if (landingPage == 'Calendar') {
      handleNavigation({
        screen: 'CalendarScreen',
        label: 'CalendarScreen',
      });
    }
    if (landingPage == 'Podcasts') {
      handleNavigation({
        screen: 'PodcastsScreen',
        label: 'PodcastsScreen',
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
    } else {
      console.log('getCurrent: ' + savedLanding);
    }
  }

  const handleNavigation = (props: DashboardNavigationProps) => {
    // SentryTest();
    console.log('parent screen: ' + props.parentScreen);
    if (props.parentScreen) {
      //  analytics.event(new Event('Dashboard', props.label + ' Pressed', '0'));
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
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <View style={styles.row}>
          <View style={styles.topPair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  parentScreen: 'PAC',
                  screen: 'PAC1',
                  params: { defaultTab: 'calls' },
                  label: 'Calls Pressed',
                })
              }
            >
              <Image source={callImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Calls</Text>}
          </View>

          <View style={styles.topPair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  parentScreen: 'PAC',
                  screen: 'PAC1',
                  params: { defaultTab: 'notes' },
                  label: 'Notes Pressed',
                })
              }
            >
              <Image source={noteImage} style={styles.logo} />
            </TouchableOpacity>
            {<Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>Notes</Text>}
          </View>

          <View style={styles.topPair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'PopBysScreen',
                  label: 'Pop-Bys Pressed',
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
                  label: 'PAC Pressed',
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
  topPair: {
    flex: 1,
    marginTop: '10%',
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  pair: {
    flex: 1,
    marginTop: '20%',
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
