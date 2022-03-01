import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { StatusBar } from 'expo-status-bar';

const analytics = new Analytics('UA-65596113-1');
let deviceHeight = Dimensions.get('window').height;

export default function PACDetailScreen() {

  const navigation = useNavigation();

  function postponePressed() {
    console.log('Postpone');
  }

  function completePressed() {
    console.log('Complete');
  }

  const [data, setData] = useState({ "data": [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPressed();
    }, 2000);

  }, []);

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

  function contactName() {
    if (!sanityCheck())
      return "";

    var displayName = data["data"]["firstName"] + " " + data["data"]["lastName"];
    console.log(displayName);
    return displayName;
  }

  function ranking() {
    if (!sanityCheck())
      return "";

    var notes = data["data"]["ranking"];
    return getRanking(notes);
  }

  function fetchPressed() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd");
    myHeaders.append("SessionToken", "56B6DEC45D864875820ECB094377E191");
    myHeaders.append("Cookie", "ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var apiURL = "https://www.referralmaker.com/services/mobileapi/contacts/c404ca6b-9f57-4ff9-a296-8f7dff936c48"
    fetch(apiURL, requestOptions)
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

          <View style={styles.topContainer}>

            <Text style={styles.personName}>{contactName()}</Text>

          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={completePressed}>
              <Text style={styles.completeText}>Complete</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={postponePressed}>
              <Text style={styles.postponeText}>Postpone</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%'
  },
  topContainer:
  {
    height: .75*deviceHeight,
    backgroundColor: 'red'
  },
  bottomContainer: {
    backgroundColor: 'white'
  },
  postponeText: {
    color: 'orange',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 20
  },
  completeText: {
    marginTop: 20,
    color: 'green',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
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
    marginTop: 20,
    marginLeft: 10,
    color: '#1A6295',
    fontSize: 18,
    textAlign: "left",
    marginLeft: 10
  },
});
