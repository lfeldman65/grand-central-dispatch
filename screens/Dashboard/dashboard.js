import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/menuIcon'; 
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react'; 
import { Analytics, PageHit, Event} from 'expo-analytics';

import callImage from '../../assets/quickCalls.png';
import noteImage from '../../assets/quickNotes.png'; 
import popImage from '../../assets/quickPop.png';
import pacImage from '../../assets/quickPAC.png';
import relImage from '../../assets/quickRel.png';
import goalsImage from '../../assets/quickGoals.png';
import transImage from '../../assets/quickTrans.png';
import todoImage from '../../assets/quickToDo.png';
import calendarImage from '../../assets/quickCalendar.png'; 

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
      headerLeft: () => (<MenuIcon/>)
    });
  });
  
  return (  
    <>
    <View style={styles.container}>

   <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={CallsPressed}>
            <Image source={callImage} style={styles.logo} />
          </TouchableOpacity>
          <Text style={styles.names}>Calls</Text>
        </View>

        <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={NotesPressed}>
            <Image source={noteImage} style={styles.logo} />
          </TouchableOpacity>
          <Text style={styles.names}>Notes</Text>
        </View>

        <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={PopPressed}>
            <Image source={popImage} style={styles.logo} />
          </TouchableOpacity>
          <Text style={styles.names}>Pop-Bys</Text>
        </View>
    </View>
    
    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={PACPressed}>
          <Image source={pacImage} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.names}>Priority Action Center</Text>
      </View>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={RelPressed}>
          <Image source={relImage} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.names}>Relationships</Text>
      </View>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={GoalsPressed}>
          <Image source={goalsImage} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.names}>Goals</Text>
      </View>
    </View>

    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={TransPressed}>
          <Image source={transImage} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.names}>Transactions</Text>
      </View>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={ToDoPressed}>
          <Image source={todoImage} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.names}>To-Do's</Text>
      </View>
      <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
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
  logo: {
    width: 48,
    height: 48,
    marginBottom: 20,
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30
  },
  names: {
    width: 60,
    height: 48,
    marginTop: -5,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
});


