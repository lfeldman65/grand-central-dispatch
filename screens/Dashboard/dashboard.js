import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';

import callImage from '../../assets/quickCalls.png';
import noteImage from '../../assets/quickNotes.png';
import popImage from '../../assets/quickPop.png';
import pacImage from '../../assets/quickPAC.png';
import relImage from '../../assets/quickRel.png';
import goalsImage from '../../assets/quickGoals.png';
import transImage from '../../assets/quickTrans.png';
import todoImage from '../../assets/quickToDo.png';
import calendarImage from '../../assets/quickCalendar.png';
//import { call } from 'react-native-reanimated';

const analytics = new Analytics('UA-65596113-1');
/*analytics.hit(new PageHit('Home'))
  .then(() => console.log("success"))
  .catch(e => console.log(e.message)); */

function CallsPressed() {
  console.log('Calls Pressed');
  analytics.event(new Event('Dashboard', 'Calls Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function NotesPressed() {
  console.log('Notes Pressed');
  analytics.event(new Event('Dashboard', 'Notes Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function PopPressed() {
  console.log('Pop Pressed');
  analytics.event(new Event('Dashboard', 'Pop-Bys Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function PACPressed() {
  console.log('PAC Pressed');
  analytics.event(new Event('Dashboard', 'PAC Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function RelPressed() {
  console.log('Rel Pressed');
  analytics.event(new Event('Dashboard', 'Relationships Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function GoalsPressed() {
  console.log('Goals Pressed');
  analytics.event(new Event('Dashboard', 'Goals Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function TransPressed() {
  console.log('Transactions Pressed');
  analytics.event(new Event('Dashboard', 'Transactions Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function ToDoPressed() {
  console.log('ToDo Pressed');
  analytics.event(new Event('Dashboard', 'To-Dos Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

function CalendarPressed() {
  console.log('Calendar Pressed');
  analytics.event(new Event('Dashboard', 'Calendar Button', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
}

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<MenuIcon />)
    });
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={CallsPressed}>
              <Image source={callImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Calls</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={NotesPressed}>
              <Image source={noteImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Notes</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={PopPressed}>
              <Image source={popImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Pop-Bys</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={PACPressed}>
              <Image source={pacImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Priority</Text>
            <Text style={styles.names}>Action</Text>
            <Text style={styles.names}>Center</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={RelPressed}>
              <Image source={relImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Relationships</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={GoalsPressed}>
              <Image source={goalsImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Goals</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={TransPressed}>
              <Image source={transImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Transactions</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={ToDoPressed}>
              <Image source={todoImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>To-Do's</Text>
          </View>
          <View style={styles.pair}>
            <TouchableOpacity onPress={CalendarPressed}>
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
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  pair: {
    flex: 1,
    marginTop: 20,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5
  },
  names: {
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
});


