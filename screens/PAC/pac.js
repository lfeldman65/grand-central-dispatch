import { Fragment, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
//import pacDetail from '../../screens/PAC/pacDetail.js';
import PACCallsRow from './PACCallsRow';
import PACNotesRow from './PACNotesRow';
import PACPopRow from './PACPopRow';
import styles from './styles';  
import {analytics} from '../../constants/analytics';

export default function PACScreen({route}) {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
 // const { contactToRemove } = route.params;
  function handlePostpone() 
  {
    analytics.event(new Event('PAC Detail', 'Postpone', 0));
    postponeAPI();
  }

  function handleComplete() 
  {
    console.log('Complete');
    analytics.event(new Event('PAC Detail', 'Complete', 0));
    navigation.navigate('PACCompleteScreen');
  //  completeAPI();
  }

  const handleRowPress = (index) => {
    console.log('row press');
    navigation.navigate("PACDetail", {"contactId": data["data"][index]["contactId"], "type": data["data"][index]["type"]});
  }

  const handleIdeasPressed = () => {
    console.log('Ideas');
  }

  const rightButtons = [
    <View style={styles.completeView}>
      <TouchableOpacity onPress={handleComplete}>
        <Text style={styles.complete}>Complete</Text>
      </TouchableOpacity>
    </View>,
  ];

  const leftButtons = [
    <View style={styles.postponeView}>
      <TouchableOpacity onPress={handlePostpone}>
        <Text style={styles.postphone}>Postpone</Text>
      </TouchableOpacity>
    </View>
    ,
  ];

  const [callsSelected, setCallsSelected] = useState(true);
  const [notesSelected, setNotesSelected] = useState(false);
  const [popSelected, setPopSelected] = useState(false);

  const [data, setData] = useState({ "data": [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<MenuIcon />)
    });
  });

  useEffect(() => {
    console.log('daniel init');
    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPressed('calls');
    }, 1000);
    console.log(route?.params?.contactToRemove)
  }, [isFocused]);

  function callsPressed() {
    analytics.event(new Event('PAC', 'Calls', 0))
    setCallsSelected(true);
    setNotesSelected(false);
    setPopSelected(false);
    fetchPressed("calls");
  }

  function notesPressed() {
    analytics.event(new Event('PAC', 'Notes', 0))
    setCallsSelected(false);
    setNotesSelected(true);
    setPopSelected(false);
    fetchPressed("notes");
  }

  function popPressed() {
    analytics.event(new Event('PAC', 'Pop-By', 0))
    setCallsSelected(false);
    setNotesSelected(false);
    setPopSelected(true);
    fetchPressed("popby");
  }

  function sanityCheck() {
    if (data == null) {
      return false;
    }
    if (data["data"] == null) {
      return false;
    }
    if (data["data"].length == 0) {
      return false;
    }
    return true;
  }

  function contactName(index) {
    if (!sanityCheck())
      return "";

    return data["data"][index]["contactName"];
  }

  function notes(index) {
    if (!sanityCheck())
      return "";

    var notes = data["data"][index]["notes"];
    return getRanking(notes);
  }

  function getRanking(notes) {
    if (!sanityCheck())
      return "";

    console.log(notes);

    return notes;
  }

  function shouldDisplay(index) {
    if (!sanityCheck())
      return false;

    return true;
  }

  function titleFor(index) {
    if (data == null) {
      return "";
    }
    if (data["data"] == null) {
      return "";
    }
    if (data["data"].length == 0) {
      return "";
    }
    return "title";
  }

  function fetchPressed(type) {
    console.log(type);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd");
    myHeaders.append("SessionToken", "56B6DEC45D864875820ECB094377E191");
    myHeaders.append("Cookie", "ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://www.referralmaker.com/services/mobileapi/priorityActions?type=" + type, requestOptions)
      .then(response => response.json()) //this line converts it to JSON
      .then((result) => {                  //then we can treat it as a JSON object
       // console.log(result);
        setData(result);
        if (result.status == "error") {
          alert(result.error);
          setIsLoading(false)
        }
        else {
          setIsLoading(false)
          //  navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch(error => alert("failure " + error));
  }

  return (

    isLoading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>) :

      (
        <View style={styles.container}>
          <View style={styles.tabButtonRow}>
            <Text style={callsSelected == true ? styles.selected : styles.unselected} onPress={callsPressed}>Calls</Text>
            <Text style={notesSelected == true ? styles.selected : styles.unselected} onPress={notesPressed}>Notes</Text>
            <Text style={popSelected == true ? styles.selected : styles.unselected} onPress={popPressed}>Pop-By</Text>
          </View>

          <ScrollView>
            {
              data["data"].map((item, index) => (
                shouldDisplay(index) ? (
                  <View>
                    { callsSelected == true ? <PACCallsRow key={index} data={item} onPress={() => handleRowPress(index)} /> : null }
                    { notesSelected == true ? <PACNotesRow key={index} data={item} onPress={() => handleRowPress(index)} /> : null }
                    { popSelected == true ? <PACPopRow key={index} data={item} onPress={() => handleRowPress(index)} /> : null }
                  </View>
                  // <Swipeable leftButtonWidth={100} rightButtonWidth={110} leftButtons={leftButtons} rightButtons={rightButtons}>

                  //   <TouchableOpacity onPress={() => handleRowPress(index)}>

                  //     <View style={styles.row} key={index}>
                  //       <Text style={styles.personName}>{contactName(index)}</Text>
                  //       <Text style={styles.notes}>{notes(index)}</Text>
                  //     </View>

                  //   </TouchableOpacity>


                  // </Swipeable>

                ) : (<View></View>)
              )

              )
            }
          </ScrollView>

          <TouchableOpacity style={styles.bottomContainer} onPress={() => handleIdeasPressed()}>
            <View style={styles.ideasButton}>
              <Text style={styles.ideasText}>{'View Ideas'}</Text>
            </View>
          </TouchableOpacity>

        </View>
      )
  );
}


