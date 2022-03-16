import React, { Fragment, useState, useEffect } from 'react';
import {
  Modal,
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
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
// import Swipeable from 'react-native-swipeable-row';
import PACCallsRow from './PACCallsRow';
import PACNotesRow from './PACNotesRow';
import PACPopRow from './PACPopRow';
import styles from './styles';
import { analytics } from '../../utils/analytics';
import { getPACData } from './api';
import { PACDataProps } from './interfaces';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';

type TabType = 'calls' | 'notes' | 'popby';

interface PACScreenProps {
  route: RouteProp<any>;
}

export default function PACScreen(props: PACScreenProps) {
  console.log('route param defaultTab', props.route.params?.defaultTab);

  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'calls');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalCallsVisible, setModalCallsVisible] = useState(false);
  const [modalNotesVisible, setModalNotesVisible] = useState(false);
  const [modalPopVisible, setModalPopVisible] = useState(false);

  const [data, setData] = useState<PACDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    analytics.event(new Event('PAC', 'Go To Details'));
    navigation.navigate('PACDetail', {
      contactId: data[index]['contactId'],
      type: data[index]['type'],
      ranking: data[index]['ranking'],
      lastCallDate: data[index]['lastCallDate'],
      lastNoteDate: data[index]['lastNoteDate'],
      lastPopByDate: data[index]['lastPopByDate'],
    });
  };

  const handleIdeasPressed = () => {
    console.log('Ideas');
    analytics.event(new Event('PAC', 'View Ideas'));
    if (tabSelected == 'calls') {
      setModalCallsVisible(!modalCallsVisible);
    } else if (tabSelected == 'notes') {
      setModalCallsVisible(!modalNotesVisible);
    } else if (tabSelected == 'popby') {
      setModalCallsVisible(!modalPopVisible);
    }
  };

  function callsPressed() {
    analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('calls');
    fetchData('calls');
  }

  function notesPressed() {
    analytics.event(new Event('PAC', 'Notes Tab'));
    setTabSelected('notes');
    fetchData('notes');
  }

  function popPressed() {
    analytics.event(new Event('PAC', 'Pop-By Tab'));
    setTabSelected('popby');
    fetchData('popby');
  }

  function fetchData(type: string) {
    setIsLoading(true);
    getPACData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    fetchData(tabSelected);
  }, [isFocused]);

  // useEffect(() => {
  //   if (route?.params?.contactToRemoveId) {
  //     const filteredData = data.filter((item) => item.contactId != route?.params?.contactToRemoveId);
  //     console.log(`filteredData: ${filteredData}`);
  //     setData(filteredData);
  //   }
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabButtonRow}>
        <Text style={tabSelected == 'calls' ? styles.selected : styles.unselected} onPress={callsPressed}>
          Calls
        </Text>
        <Text style={tabSelected == 'notes' ? styles.selected : styles.unselected} onPress={notesPressed}>
          Notes
        </Text>
        <Text style={tabSelected == 'popby' ? styles.selected : styles.unselected} onPress={popPressed}>
          Pop-By
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {data.map((item, index) => (
              <View key={index}>
                {tabSelected == 'calls' ? (
                  <PACCallsRow key={index} data={item} onPress={() => handleRowPress(index)} />
                ) : null}
                {tabSelected == 'notes' ? (
                  <PACNotesRow key={index} data={item} onPress={() => handleRowPress(index)} />
                ) : null}
                {tabSelected == 'popby' ? (
                  <PACPopRow key={index} data={item} onPress={() => handleRowPress(index)} />
                ) : null}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.bottomContainer} onPress={() => handleIdeasPressed()}>
            <View style={styles.ideasButton}>
              <Text style={styles.ideasText}>{'View Ideas'}</Text>
            </View>
          </TouchableOpacity>
          {modalCallsVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalCallsVisible}
              onRequestClose={() => {
                //  Alert.alert('Modal has been closed.');
                setModalCallsVisible(!modalCallsVisible);
              }}
            >
              <IdeasCalls setModalCallsVisible={setModalCallsVisible} />
            </Modal>
          )}
          {modalNotesVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalNotesVisible}
              onRequestClose={() => {
                //  Alert.alert('Modal has been closed.');
                setModalNotesVisible(!modalNotesVisible);
              }}
            >
              <IdeasNotes setModalNotesVisible={setModalNotesVisible} />
            </Modal>
          )}
          {modalPopVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalPopVisible}
              onRequestClose={() => {
                //  Alert.alert('Modal has been closed.');
                setModalNotesVisible(!modalPopVisible);
              }}
            >
              <IdeasPop setModalPopVisible={setModalPopVisible} />
            </Modal>
          )}
        </React.Fragment>
      )}
    </View>
  );
}
