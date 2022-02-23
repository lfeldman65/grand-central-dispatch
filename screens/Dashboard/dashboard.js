import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import {useState} from "react"; 

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


export default function Dashboard(props) {
  //const { navigation } = props;
  const [expanded, setExpanded] = useState({
    relationships: false,
    transactions: false,
  });
  
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<MenuIcon />)
    });
  });

  const pressedCalls = (screenName) => 
  {
    console.log(screenName);
    analytics.event(new Event('Dashboard', 'Calls', 'Pressed', 0))
  	navigation.navigate(screenName)
  }

  const pressedNotes = (screenName) => 
  {
    console.log(screenName);
    analytics.event(new Event('Dashboard', 'Notes', 'Pressed', 0))
  	navigation.navigate(screenName)
  }

  const otherPressed = (screenName) => 
  {
    console.log(screenName);
    var prettyName = screenName;
    if(screenName == "manageRelationships") 
    {
      prettyName = "Relationships";
    }
    else if(screenName == "realEstateTransactions") 
    {
      prettyName = "Transactions";
    }
    analytics.event(new Event('Dashboard', prettyName, 'Pressed', 0))
  	navigation.navigate(screenName)
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => pressedCalls('PAC')}>
              <Image source={callImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Calls</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => pressedNotes('PAC')}>
              <Image source={noteImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Notes</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('Pop-Bys')}>
              <Image source={popImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Pop-Bys</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('PAC')}>
              <Image source={pacImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Priority</Text>
            <Text style={styles.names}>Action</Text>
            <Text style={styles.names}>Center</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('manageRelationships')}>
              <Image source={relImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Relationships</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('Goals')}>
              <Image source={goalsImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Goals</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('realEstateTransactions')}>
              <Image source={transImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>Transactions</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('To-Do')}>
              <Image source={todoImage} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.names}>To-Do's</Text>
          </View>
          <View style={styles.pair}>
          <TouchableOpacity onPress={() => otherPressed('Calendar')}>
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


