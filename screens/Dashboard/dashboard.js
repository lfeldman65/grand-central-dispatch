import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/menuIcon'; 
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react'; 

import callImage from '../../assets/quickCalls.png';
import noteImage from '../../assets/quickNotes.png'; 
import popImage from '../../assets/quickPop.png';
import pacImage from '../../assets/quickPAC.png';
import relImage from '../../assets/quickRel.png';
import goalsImage from '../../assets/quickGoals.png';
import transImage from '../../assets/quickTrans.png';
import todoImage from '../../assets/quickToDo.png';
import calendarImage from '../../assets/quickCalendar.png'; 

function CallsPressed() {  // test
  console.log('Calls Pressed');
}

function NotesPressed() {
  console.log('Notes Pressed');
}

function PopPressed() {
  console.log('Pop Pressed');
}

function PACPressed() {
  console.log('PAC Pressed');
  
}

function RelPressed() {
  console.log('Rel Pressed');
}

function GoalsPressed() {
  console.log('Goals Pressed');
}

function TransPressed() {
  console.log('Transactions Pressed');
}

function ToDoPressed() {
  console.log('ToDo Pressed');
}

function CalendarPressed() {
  console.log('Calendar Pressed');
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


