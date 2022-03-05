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

let deviceHeight = Dimensions.get('window').height;

export default function PACDetailScreen({ route }) {
  const { contactId, type } = route.params;
  const navigation = useNavigation();

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
        console.log(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  function postponePressed() {
    // console.log('type: ' + type);
    analytics.event(new Event('PAC Detail', 'Postpone', 0));
    postponeAPI();
  }

  async function completePressed() {
    console.log('complete pressed: ' + contactId);
    analytics.event(new Event('PAC Detail', 'Complete', 0));
    await storeData('pacID', contactId);
    setModalVisible(!modalVisible);
    //   navigation.navigate('PACCompleteScreen');
    // completeAPI();
  }

  function saveComplete(note) {
    // console.log('Note ', note);
    completeAPI(note);
  }

  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPACData();
    }, 2000);
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
    return data['data'][type];
  }

  function address(type) {
    if (!sanityCheck()) return '';
    return data['data']['address'][type];
  }

  function ranking() {
    if (!sanityCheck()) return '';

    var notes = data['data']['ranking'];
    return getRanking(notes);
  }

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

  function postponeAPI() {
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

  function toggleModalVisibility() {
    setModalVisible(!modalVisible);
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.personName}>{contactName()}</Text>

        {/* <Text style={styles.detailTitle}>{contactId}</Text> */}

        {/* {phoneNumber('mobile') !== '' && (
          <View>
            <Text style={styles.detailTitle}>{'Mobile Phone'}</Text>
            <Text style={styles.phoneNumber}>{phoneNumber('mobile')}</Text>
          </View>
        )}

        {phoneNumber('officePhone') !== '' && (
          <View>
            <Text style={styles.detailTitle}>{'Office Phone'}</Text>
            <Text style={styles.phoneNumber}>{phoneNumber('officePhone')}</Text>)
          </View>
        )}

        {phoneNumber('homePhone') !== '' && (
          <View>
            <Text style={styles.detailTitle}>{'Home Phone'}</Text>
            <Text style={styles.phoneNumber}>{phoneNumber('homePhone')}</Text>)
          </View>
        )} */}

        {/* <Text style={styles.detailTitle}>{'Home Phone'}</Text>

        <Text style={styles.phoneNumber}>{phoneNumber('homePhone')}</Text> */}

        {/* <Text style={styles.detailTitle}>{'Location'}</Text>

        <Text style={styles.detailTitle}>{address('street')}</Text>
        <Text style={styles.detailTitle}>{address('street2')}</Text>
        <Text style={styles.detailTitle}>{address('city') + ' ' + address('state') + ' ' + address('zip')}</Text>

        <Text style={styles.detailTitle}>{'Notes'}</Text> */}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={completePressed}>
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={postponePressed}>
          <Text style={styles.postponeText}>Postpone</Text>
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
          <PacComplete onSave={saveComplete} setModalVisible={setModalVisible} />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  topContainer: {
    height: 0.75 * deviceHeight,
    backgroundColor: 'white',
  },
  bottomContainer: {
    backgroundColor: 'white',
  },
  detailTitle: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    width: 180,
  },
  phoneNumber: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    width: 180,
  },
  postponeText: {
    color: 'orange',
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
  personName: {
    marginTop: 20,
    marginLeft: 20,
    color: '#1A6295',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 20,
    // fontWeight: 'bold'
  },
});

const stylesModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '90%',
    width: '90%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
