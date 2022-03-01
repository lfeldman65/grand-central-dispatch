import { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
import pacDetail from '../../screens/PAC/pacDetail.js';

const analytics = new Analytics('UA-65596113-1');

function handleComplete() {
  console.log('Complete');
}

function handlePostpone() {
  console.log('Postpone');
}

export default function PACScreen() {

  const navigation = useNavigation();

  const handleRowPress = (index) => {
    console.log('row press');
    navigation.navigate("PACDetail");  // Error
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

  let deviceWidth = Dimensions.get('window').width;

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

    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPressed('calls');
    }, 2000);

  }, []);

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
        console.log(result);
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
              data["data"].map((name, index) => (
                shouldDisplay(index) ? (

                  <Swipeable leftButtonWidth={100} rightButtonWidth={110} leftButtons={leftButtons} rightButtons={rightButtons}>

                    <TouchableOpacity onPress={() => handleRowPress(index)}>

                      <View style={styles.row} key={index}>
                        <Text style={styles.personName}>{contactName(index)}</Text>
                        <Text style={styles.notes}>{notes(index)}</Text>
                      </View>

                    </TouchableOpacity>


                  </Swipeable>

                ) : (<View></View>)
              )

              )
            }
            <View style={styles.hack}></View>
          </ScrollView>
        </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  hack: {
    height: 100,
    backgroundColor: 'white',
  },
  completeView: {

    backgroundColor: 'green',
    fontSize: 20,
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    paddingLeft: 20

  },
  complete: {
    width: 200,
    color: 'orange',
    fontSize: 20,
    fontSize: 16
  },
  postponeView: {

    backgroundColor: 'orange',
    fontSize: 20,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  postpone: {
    width: 200,
    color: 'white',
    fontSize: 20,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 16
  },
  row: {
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: .5,
    paddingBottom: 10
  },
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 10
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 10,
    borderColor: 'lightblue',
    borderWidth: 2
  },
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  notes: {
    width: 200,
    color: '#1A6295',
    fontSize: 20,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 16
  },
  personName: {
    width: 400,
    height: 32,
    color: 'black',
    fontSize: 18,
    textAlign: "left",
    marginLeft: 10
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },

});
