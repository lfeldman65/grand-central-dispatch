import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import PacComplete from './PACCompleteScreen';
import { postponePAC, completePAC, saveAsFavorite, getPACDetails } from './api';
import openMap from 'react-native-open-maps';
import { styles } from './styles';
import { storage } from '../../utils/storage';

let deviceHeight = Dimensions.get('window').height;

export default function PACDetailScreen(props: any) {
  const { route } = props;
  const { contactId, type, ranking, lastCallDate, lastNoteDate, lastPopByDate } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState<any>({ data: [] });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // const [data1, setData1] = useState<PACCompleteProps[]>([]);
  // const [data2, setData2] = useState<PACPostponeProps[]>([]);

  function postponePressed() {
    analytics.event(new Event('PAC Detail', 'Postpone', '0'));
    // postponeActionOld();
    postponeAction(contactId, type);
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
    analytics.event(new Event('PAC Detail', 'Complete', '0'));
    setModalVisible(true);
  }

  function saveComplete(note: string) {
    // console.log('Note ', note);
    //   completeActionOld(note);
    completeAction(contactId, type, note);
    //  completeAction();
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

  function isNotNullOrEmpty(value: string | number) {
    return value != null && value != '';
  }

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

  function phoneNumber(type: string) {
    if (!sanityCheck()) return '';
    const phone = data['data'][type];
    // console.log('phone = ' + phone);
    if (phone == null || phone == '') {
      return '';
    }
    return phone;
  }

  function address(type: string) {
    if (!sanityCheck()) return '';
    console.log('addressxx: ' + data['data']['address'][type]);
    return data['data']['address'][type];
  }

  function completeAction(contactId: string, type: string, note: string) {
    setIsLoading(true);
    console.log('contactId: ' + contactId);
    console.log('type: ' + type);
    console.log('note: ' + note);
    completePAC(contactId, type, note)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
        }
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => console.error('failure ' + error));
  }

  function completeActionOld(note: string) {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', token);
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
      //   redirect: 'follow',
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
          console.error(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          navigation.goBack();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function postponeAction(contactId: string, type: string) {
    setIsLoading(true);
    postponePAC(contactId, type)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
        }
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => console.error('failure ' + error));
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
      //   redirect: 'follow',
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
          console.error(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          navigation.goBack();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchPacDetailDataNew(id: string) {
    setIsLoading(true);
    getPACDetails(id)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchPacDetailData() {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      //  redirect: 'follow',
    };

    var apiURL = 'https://www.referralmaker.com/services/mobileapi/contacts/' + contactId;
    // console.log('contact api: ' + apiURL);
    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        setData(result);
        console.log(result);
        if (result.status == 'error') {
          console.error(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  // function toggleModalVisibility() {
  //   setModalVisible(!modalVisible);
  // }

  async function fetchToken() {
    const tokenFromStorage = await storage.getItem('sessionToken');
    console.log('token: ' + tokenFromStorage);
    setToken(tokenFromStorage);
  }

  //put it in a useEffect to prevent the warning about rendering a different component blah blah
  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: contactName() });
  }); // this will run on every rendeer
  useEffect(() => {
    fetchToken();
    fetchPacDetailData();
  }, []);

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
    color: '#1C6597',
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
    color: '#1C6597',
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
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
  },
});
