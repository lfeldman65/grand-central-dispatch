import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import PacComplete from './PACCompleteScreen';
import { postponePAC, completePAC, getPACDetails } from './api';
import openMap from 'react-native-open-maps';
import { styles } from './styles';
import { storage } from '../../utils/storage';
import { isNullOrEmpty } from '../../utils/general';
import { AddressProps, ContactDetailDataProps } from './interfaces';
import { add } from 'react-native-reanimated';

let deviceHeight = Dimensions.get('window').height;

export default function PACDetailScreen(props: any) {
  const { route } = props;
  const { contactId, type, ranking, lastCallDate, lastNoteDate, lastPopByDate } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState<ContactDetailDataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  function postponePressed() {
    analytics.event(new Event('PAC Detail', 'Postpone', '0'));
    // postponeActionOld();
    postponeAction(contactId, type);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
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

  function handleDirectionsPressed(address?: AddressProps) {
    console.log('Directions');
    openMap({ query: completeAddress(address) });
  }

  function cityStateZip(address?: AddressProps) {
    var cityStateZip = '';
    if (!isNullOrEmpty(address?.city)) {
      cityStateZip = address?.city!;
    }
    if (!isNullOrEmpty(address?.state)) {
      cityStateZip = cityStateZip + ', ' + address?.state;
    }
    if (!isNullOrEmpty(address?.zip)) {
      cityStateZip = cityStateZip + ' ' + address?.zip;
    }
    return cityStateZip;
  }

  function completeAddress(address?: AddressProps) {
    var completeAddress = '';
    if (!isNullOrEmpty(address?.street)) {
      completeAddress = address?.street!;
    }
    if (!isNullOrEmpty(address?.street2)) {
      completeAddress = completeAddress + ' ' + address?.street2!;
    }
    return completeAddress + cityStateZip(address);
  }

  function contactName() {
    if (data?.firstName == null) {
      return '';
    }
    if (data?.lastName == null) {
      return '';
    }
    return data?.firstName + ' ' + data?.lastName;
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
        }
        setIsLoading(false);
        navigation.goBack();
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
        }
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchPacDetailData(id: string) {
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

  //put it in a useEffect to prevent the warning about rendering a different component blah blah
  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: contactName() });
  }); // this will run on every rendeer
  useEffect(() => {
    fetchPacDetailData(contactId);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
      <View style={lightOrDark == 'dark' ? stylesDetail.topContainerDark : stylesDetail.topContainerLight}>
        <Text style={stylesDetail.personName}>{contactName()}</Text>

        {!isNullOrEmpty(data?.mobile) && <Text style={stylesDetail.sectionTitle}>{'Mobile Phone'}</Text>}
        {!isNullOrEmpty(data?.mobile) && <Text style={stylesDetail.phoneNumber}>{data?.mobile}</Text>}

        {!isNullOrEmpty(data?.officePhone) && <Text style={stylesDetail.sectionTitle}>{'Office Phone'}</Text>}
        {!isNullOrEmpty(data?.officePhone) && <Text style={stylesDetail.phoneNumber}>{data?.officePhone}</Text>}

        {!isNullOrEmpty(data?.homePhone) && <Text style={stylesDetail.sectionTitle}>{'Home Phone'}</Text>}
        {!isNullOrEmpty(data?.homePhone) && <Text style={stylesDetail.phoneNumber}>{data?.homePhone}</Text>}

        <View style={styles.popbyRow}>
          {!isNullOrEmpty(data?.address.street) && <Text style={stylesDetail.sectionTitle}>Location</Text>}
          {!isNullOrEmpty(data?.address.street) && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed(data?.address)}>
              <Text style={styles.popByButtons}>{'Directions'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isNullOrEmpty(data?.address.street) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.cityStateZipTextDark : stylesDetail.cityStateZipTextLight}>
            {data?.address.street}
          </Text>
        )}
        {!isNullOrEmpty(data?.address.street2) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
            {data?.address.street2}
          </Text>
        )}
        {!isNullOrEmpty(cityStateZip(data?.address)) && (
          <Text style={lightOrDark == 'dark' ? stylesDetail.cityStateZipTextDark : stylesDetail.cityStateZipTextLight}>
            {cityStateZip(data?.address)}
          </Text>
        )}

        <Text style={stylesDetail.sectionTitle}>Notes</Text>
        <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
          {'Ranking: ' + ranking}
        </Text>
        <Text style={lightOrDark == 'dark' ? stylesDetail.standardTextDark : stylesDetail.standardTextLight}>
          {lastDate()}
        </Text>
      </View>

      <View style={lightOrDark == 'dark' ? stylesDetail.bottomContainerDark : stylesDetail.bottomContainerLight}>
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
  topContainerDark: {
    height: 0.7 * deviceHeight,
    backgroundColor: 'black',
  },
  topContainerLight: {
    height: 0.7 * deviceHeight,
    backgroundColor: 'white',
  },
  personName: {
    marginTop: 20,
    marginLeft: 20,
    color: '#1398F5',
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
  bottomContainerDark: {
    backgroundColor: 'black',
  },
  bottomContainerLight: {
    backgroundColor: 'white',
  },
  standardTextDark: {
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
  },
  standardTextLight: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 5,
  },
  cityStateZipTextDark: {
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  cityStateZipTextLight: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  phoneNumber: {
    color: '#1398F5',
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
});
