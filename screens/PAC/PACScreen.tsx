import { Fragment, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
//import pacDetail from '../../screens/PAC/pacDetail.js';
import PACCallsRow from './PACCallsRow';
import PACNotesRow from './PACNotesRow';
import PACPopRow from './PACPopRow';
import styles from './styles';
import { analytics } from '../../utils/analytics';
import { getPACData } from './api';
import { PACDataProps } from './interfaces';

export default function PACScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [callsSelected, setCallsSelected] = useState(true);
  const [notesSelected, setNotesSelected] = useState(false);
  const [popSelected, setPopSelected] = useState(false);

  const [data, setData] = useState<PACDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index) => {
    analytics.event(new Event('PAC', 'Go To Details'));
    navigation.navigate('PACDetail', {
      contactId: data[index]['contactId'],
      type: data[index]['type'],
    });
  };

  const handleIdeasPressed = () => {
    console.log('Ideas');
    analytics.event(new Event('PAC', 'View Ideas'));
  };

  function callsPressed() {
    analytics.event(new Event('PAC', 'Calls Tab'));
    setCallsSelected(true);
    setNotesSelected(false);
    setPopSelected(false);
    fetchData('calls');
  }

  function notesPressed() {
    analytics.event(new Event('PAC', 'Notes Tab'));
    setCallsSelected(false);
    setNotesSelected(true);
    setPopSelected(false);
    fetchData('notes');
  }

  function popPressed() {
    analytics.event(new Event('PAC', 'Pop-By Tab'));
    setCallsSelected(false);
    setNotesSelected(false);
    setPopSelected(true);
    fetchData('popby');
  }

  function fetchData(type) {
    setIsLoading(true);
    getPACData(type)
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    setTimeout(() => {
      fetchData('calls');
    }, 500);
  }, [isFocused]);

  // useEffect(() => {
  //   if (route?.params?.contactToRemoveId) {
  //     const filteredData = data.filter((item) => item.contactId != route?.params?.contactToRemoveId);
  //     console.log(`filteredData: ${filteredData}`);
  //     setData(filteredData);
  //   }
  // }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.tabButtonRow}>
        <Text style={callsSelected == true ? styles.selected : styles.unselected} onPress={callsPressed}>
          Calls
        </Text>
        <Text style={notesSelected == true ? styles.selected : styles.unselected} onPress={notesPressed}>
          Notes
        </Text>
        <Text style={popSelected == true ? styles.selected : styles.unselected} onPress={popPressed}>
          Pop-By
        </Text>
      </View>

      <ScrollView>
        {data.map((item, index) => (
          <View key={index}>
            {callsSelected == true ? (
              <PACCallsRow key={index} data={item} onPress={() => handleRowPress(index)} />
            ) : null}
            {notesSelected == true ? (
              <PACNotesRow key={index} data={item} onPress={() => handleRowPress(index)} />
            ) : null}
            {popSelected == true ? <PACPopRow key={index} data={item} onPress={() => handleRowPress(index)} /> : null}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.bottomContainer} onPress={() => handleIdeasPressed()}>
        <View style={styles.ideasButton}>
          <Text style={styles.ideasText}>{'View Ideas'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
