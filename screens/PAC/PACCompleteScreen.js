import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

var pacID = '';

async function SavePressed() {
  pacID = await getData('pacID');
  console.log('pac id: ' + pacID);
  completeAPI();
}

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      //  console.log(value);
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

function completeAPI() {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
  myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
  myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    type: 'Calls',
    note: 'some note',
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  var apiURL = 'https://www.referralmaker.com/services/mobileapi/contactsTrackAction/' + pacID;
  console.log('complete: ' + apiURL);
  fetch(apiURL, requestOptions)
    .then((response) => response.json()) //this line converts it to JSON
    .then((result) => {
      //then we can treat it as a JSON object
      console.log(result);
      //  setData(result);
      if (result.status == 'error') {
        alert(result.error);
        //  setIsLoading(false);
      } else {
        //   setIsLoading(false);
        //   navigation.goBack();
      }
    })
    .catch((error) => alert('failure ' + error));
}

export default function PACCompleteScreen(props) {
  const { onSave, setModalVisible } = props;
  const [note, onNoteChange] = useState('');

  // const navigation = useNavigation();

  function SavePressed() {
    onSave(note);
  }

  function CancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Type Here"
          placeholderTextColor="#AFB9C2"
          color="black"
          textAlign="left"
          value={note}
          onChangeText={onNoteChange}
          //   fontSize={18}
        />
      </View>

      <TouchableOpacity onPress={SavePressed}>
        <Text style={styles.loginText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={CancelPressed}>
        <Text style={styles.loginText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    alignItems: 'center',
  },
  logo: {
    width: 173,
    height: 242,
    marginBottom: 20,
    marginTop: 40,
  },
  inputView: {
    marginTop: 40,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    //  alignItems: "baseline",
    //  justifyContent: "center",
    paddingLeft: 10,
    fontSize: 29,
  },
  loginText: {
    width: 100,
    height: 32,
    marginTop: 25,
    color: '#37C0FF',
    fontSize: 25,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 18,
  },
});
