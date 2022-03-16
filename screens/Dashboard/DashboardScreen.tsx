import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';

const callImage = require('../../assets/quickCalls.png');
const noteImage = require('../../assets/quickNotes.png');
const popImage = require('../../assets/quickPop.png');
const pacImage = require('../../assets/quickPAC.png');
const relImage = require('../../assets/quickRel.png');
const goalsImage = require('../../assets/quickGoals.png');
const transImage = require('../../assets/quickTrans.png');
const todoImage = require('../../assets/quickToDo.png');
const calendarImage = require('../../assets/quickCalendar.png');

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

  async function testOutAsyncStorage() {
    const userNameFromStorage = await storage.getItem('userName');
    console.log(userNameFromStorage);
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    testOutAsyncStorage();
  }, []);

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
      <View style={styles.container}>
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
            <Text style={styles.names}>Calls</Text>
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
            <Text style={styles.names}>Notes</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'Pop-Bys',
                  label: 'Pop-Bys Pressed',
                })
              }
            >
              <Image source={popImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Pop-Bys</Text>
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
            <Text style={styles.names}>Priority</Text>
            <Text style={styles.names}>Action</Text>
            <Text style={styles.names}>Center</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'manageRelationships',
                  label: 'Relationships',
                })
              }
            >
              <Image source={relImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Relationships</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'Goals',
                  label: 'Goals',
                })
              }
            >
              <Image source={goalsImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Goals</Text>
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
            <Text style={styles.names}>Transactions</Text>
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
            <Text style={styles.names}>To-Do's</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity
              onPress={() =>
                handleNavigation({
                  screen: 'Calendar',
                  label: 'Calendar',
                })
              }
            >
              <Image source={calendarImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Calendar</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: 'white',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5,
  },
  names: {
    height: 18,
    color: 'black',
    textAlign: 'center',
  },
});
