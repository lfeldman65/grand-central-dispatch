import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Event } from 'expo-analytics';

const callImage = require('../Dashboard/images/quickCalls.png');
const noteImage = require('../Dashboard/images/quickNotes.png');
const popImage = require('../Dashboard/images/quickPop.png');
const pacImage = require('../Dashboard/images/quickPAC.png');
const relImage = require('../Dashboard/images/quickRel.png');
const goalsImage = require('../Dashboard/images/quickGoals.png');
const transImage = require('../Dashboard/images/quickTrans.png');
const todoImage = require('../Dashboard/images/quickToDo.png');
const calendarImage = require('../Dashboard/images/quickCalendar.png');

import { analytics } from '../../utils/analytics';
import { storage } from '../../utils/storage';

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
  // var isDarkMode = false;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  const handleNavigation = (props: DashboardNavigationProps) => {
    if (props.parentScreen) {
      analytics.event(new Event('Dashboard', props.label + ' Pressed', '0'));
      navigation.navigate(props.parentScreen, {
        screen: props.screen,
        params: props.params ? props.params : null,
      });
    } else {
      props.params ? navigation.navigate(props.screen, { ...props.params }) : navigation.navigate(props.screen);
    }
  };

  return (
    <>
      <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
        <View style={styles.row}>
          <View style={styles.pair}>
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

          <View style={styles.pair}>
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

          <View style={styles.pair}>
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
                  screen: 'manageRelationships', // what?
                  label: 'Relationships', // what?
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
                  screen: 'realEstateTransactions',
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
  containerDark: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
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
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  namesLight: {
    height: 18,
    color: 'black',
    textAlign: 'center',
  },
});
