import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { StatusBar } from 'expo-status-bar';
import { analytics } from '../../utils/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PacComplete from '../PAC/PACCompleteScreen';
import { postponePAC, completePAC, saveAsFavorite } from './api';
import { PACPostponeProps, PACCompleteProps, SaveAsFavoriteProps } from './interfaces';
import openMap from 'react-native-open-maps';
import styles from './styles';

let deviceHeight = Dimensions.get('window').height;

export default function PACDetailScreen({ route }) {
  const { contactId, type, ranking, lastCallDate, lastNoteDate, lastPopByDate } = route.params;
  const navigation = useNavigation();

  function postponePressed() {
    analytics.event(new Event('PAC Detail', 'Postpone', 0));
    postponeAPIOld();
    //  postponeAPINew();
  }

  function lastDate() {
    if (type == 'call') {
      return 'Last Call: ' + lastCallDate;
    }
    if (type == 'notes') {
      return 'Last Note Sent: ' + lastNoteDate;
    }
    if (type == 'popby') {
      return 'Last Pop-By: ' + lastPopByDate;
    }
  }

  async function completePressed() {
    console.log('complete pressed: ' + contactId);
    analytics.event(new Event('PAC Detail', 'Complete', 0));
    setModalVisible(!modalVisible);
  }

  function saveComplete(note) {
    // console.log('Note ', note);
    completeAPI(note);
  }

  function handleDirectionsPressed() {
    console.log('Directions');
    openMap({ query: completeAddress() });
  }

  function cityStateZip() {
    var cityStateZip = '';
    if (isNotNullOrEmpty(address('city'))) {
      cityStateZip = address('city');
    }
    if (isNotNullOrEmpty(address('state'))) {
      cityStateZip = cityStateZip + ', ' + address('state');
    }
    if (isNotNullOrEmpty(address('zip'))) {
      cityStateZip = cityStateZip + ' ' + address('zip');
    }
    return cityStateZip;
  }

  function completeAddress() {
    var completeAddress = '';
    if (isNotNullOrEmpty(address('street'))) {
      completeAddress = address('street');
    }
    if (isNotNullOrEmpty(address('street2'))) {
      completeAddress = completeAddress + ' ' + address('street2');
    }
    return completeAddress + cityStateZip();
  }

  function isNotNullOrEmpty(data) {
    return data != null && data != '';
  }

  const [data, setData] = useState({ data: [] });

  // const [data1, setData1] = useState<PACCompleteProps[]>([]);
  // const [data2, setData2] = useState<PACPostponeProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  //put it in a useEffect to prevent the warning about rendering a different component blah blah
  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: contactName() });
  }); // this will run on every rendeer
  useEffect(() => {
    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPACData();
    }, 250);
  }, []);

  function sanityCheck() {
    if (data == null) {
      return false;
    }
    if (data['data'] == null) {
      return false;
    }
    if (data['data'].length == 0) {
      return false;
    }
    return true;
  }

  function contactName() {
    if (!sanityCheck()) return '';
    return data['data']['firstName'] + ' ' + data['data']['lastName'];
  }

  function phoneNumber(type) {
    if (!sanityCheck()) return '';
    const phone = data['data'][type];
    console.log('phone = ' + phone);
    if (phone == null || phone == '') {
      return '';
    }
    return phone;
  }

  function address(type) {
    if (!sanityCheck()) return '';
    return data['data']['address'][type];
  }

  // function ranking() {
  //   if (!sanityCheck()) return '';

  //   //  var notes = data['data']['ranking'];
  //   return getRanking(notes);
  // }

  function completeAPI(note) {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      type: type,
      note: note,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    var apiURL = 'https://www.referralmaker.com/services/mobileapi/contactsTrackAction/' + contactId;
    console.log('complete: ' + apiURL);
    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        // console.log(result);
        //  setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          navigation.goBack();
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  function postponeAPINew(relID) {
    // Testing!!!
    setIsLoading(true);
    postPACPostpone(relID)
      .then((res) => {
        if (res.status == 'error') {
          alert(res.error);
        } else {
          setData(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => alert('failure ' + error));
  }

  function postponeAPIOld() {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      type: type,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    var apiURL = 'https://www.referralmaker.com/services/mobileapi/contactsPostponeAction/' + contactId;
    console.log('postpone: ' + apiURL);
    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        // console.log(result);
        //  setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          navigation.goBack();
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  function fetchPACData() {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    var apiURL = 'https://www.referralmaker.com/services/mobileapi/contacts/' + contactId;
    console.log('contact api: ' + apiURL);
    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        // console.log(result);
        setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  // function toggleModalVisibility() {
  //   setModalVisible(!modalVisible);
  // }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={stylesDetail.topContainer}>
        <Text style={stylesDetail.personName}>{contactName()}</Text>

        {isNotNullOrEmpty(phoneNumber('mobile')) && <Text style={stylesDetail.sectionTitle}>{'Mobile Phone'}</Text>}
        {isNotNullOrEmpty(phoneNumber('mobile')) && (
          <Text style={stylesDetail.phoneNumber}>{phoneNumber('mobile')}</Text>
        )}

        {isNotNullOrEmpty(phoneNumber('officePhone')) && (
          <Text style={stylesDetail.sectionTitle}>{'Office Phone'}</Text>
        )}
        {isNotNullOrEmpty(phoneNumber('officePhone')) && (
          <Text style={stylesDetail.phoneNumber}>{phoneNumber('officePhone')}</Text>
        )}

        {isNotNullOrEmpty(phoneNumber('homePhone')) && <Text style={stylesDetail.sectionTitle}>{'Home Phone'}</Text>}
        {isNotNullOrEmpty(phoneNumber('homePhone')) && (
          <Text style={stylesDetail.phoneNumber}>{phoneNumber('homePhone')}</Text>
        )}

        <View style={styles.popbyRow}>
          {completeAddress() != '' && <Text style={stylesDetail.sectionTitle}>Location</Text>}
          {address('street') != null && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed()}>
              <Text style={styles.popByButtons}>{'Directions'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {isNotNullOrEmpty(address('street')) && <Text style={stylesDetail.standardText}>{address('street')}</Text>}
        {isNotNullOrEmpty(address('street2')) && <Text style={stylesDetail.standardText}>{address('street2')}</Text>}
        {isNotNullOrEmpty(cityStateZip()) && <Text style={stylesDetail.cityStateZipText}>{cityStateZip()}</Text>}

        <Text style={stylesDetail.sectionTitle}>Notes</Text>
        <Text style={stylesDetail.standardText}>{'Ranking: ' + ranking}</Text>
        <Text style={stylesDetail.standardText}>{lastDate()}</Text>
      </View>

      <View style={stylesDetail.bottomContainer}>
        <TouchableOpacity onPress={completePressed}>
          <Text style={stylesDetail.completeText}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={postponePressed}>
          <Text style={stylesDetail.postponeText}>Postpone</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <PacComplete contactName={contactName()} onSave={saveComplete} setModalVisible={setModalVisible} />
        </Modal>
      )}
    </View>
  );
}

const stylesDetail = StyleSheet.create({
  topContainer: {
    height: 0.75 * deviceHeight,
    backgroundColor: 'white',
  },
  personName: {
    marginTop: 20,
    marginLeft: 20,
    color: '#02ABF7',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 30,
  },
  sectionTitle: {
    marginLeft: 20,
    color: 'gray',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: 'white',
  },
  standardText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
  },
  cityStateZipText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  phoneNumber: {
    color: '#02ABF7',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    width: 180,
    marginBottom: 15,
  },
  postponeText: {
    color: '#F99055',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  completeText: {
    marginTop: 20,
    color: 'green',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  notes: {
    width: 200,
    color: '#1A6295',
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
  },
});
