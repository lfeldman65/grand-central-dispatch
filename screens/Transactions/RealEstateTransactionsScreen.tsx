import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Event } from 'expo-analytics';
// import Swipeable from 'react-native-swipeable-row';
import TransactionRow from './TransactionRow';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import { getTransactionData } from './api';
import { TransactionDataProps } from './interfaces';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';
import globalStyles from '../../globalStyles';

type TabType = 'potential' | 'active' | 'pending' | 'closed';

interface TransactionScreenProps {
  route: RouteProp<any>;
}

export default function RealEstateTransactionsScreen(props: TransactionScreenProps) {
  // console.log('route param defaultTab', props.route.params?.defaultTab);

  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'potential');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalCallsVisible, setModalCallsVisible] = useState(false);
  const [modalNotesVisible, setModalNotesVisible] = useState(false);
  const [modalPopVisible, setModalPopVisible] = useState(false);

  const [data, setData] = useState<TransactionDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    analytics.event(new Event('Transactions', 'Row Pressed'));
    // navigation.navigate('PACDetail', {
    //   contactId: data[index]['contactId'],
    //   type: data[index]['type'],
    //   ranking: data[index]['ranking'],
    //   lastCallDate: data[index]['lastCallDate'],
    //   lastNoteDate: data[index]['lastNoteDate'],
    //   lastPopByDate: data[index]['lastPopByDate'],
    // });
  };

  const handleAddPressed = () => {
    console.log('Add');
    analytics.event(new Event('Transactions', 'Add Transaction'));
    // if (tabSelected == 'calls') {
    //   setModalCallsVisible(!modalCallsVisible);
    // } else if (tabSelected == 'notes') {
    //   setModalNotesVisible(!modalNotesVisible);
    // } else if (tabSelected == 'popby') {
    //   setModalPopVisible(!modalPopVisible);
    // }
  };

  function potentialPressed() {
    analytics.event(new Event('PAC', 'Notes Tab'));
    setTabSelected('potential');
    fetchData('potential', 'Realtor');
  }

  function activePressed() {
    analytics.event(new Event('PAC', 'Pop-By Tab'));
    setTabSelected('active');
    fetchData('active', 'Realtor');
  }

  function pendingPressed() {
    analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('pending');
    fetchData('pending', 'Realtor');
  }

  function closedPressed() {
    analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('closed');
    fetchData('closed', 'Realtor');
  }

  function fetchData(status: string, type: string) {
    setIsLoading(true);
    getTransactionData(status, type)
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
    fetchData(tabSelected, 'Realtor');
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
      <View style={globalStyles.tabButtonRow}>
        <Text
          style={tabSelected == 'potential' ? globalStyles.selected : globalStyles.unselected}
          onPress={potentialPressed}
        >
          Potential
        </Text>
        <Text style={tabSelected == 'active' ? globalStyles.selected : globalStyles.unselected} onPress={activePressed}>
          Active
        </Text>
        <Text
          style={tabSelected == 'pending' ? globalStyles.selected : globalStyles.unselected}
          onPress={pendingPressed}
        >
          Pending
        </Text>
        <Text style={tabSelected == 'closed' ? globalStyles.selected : globalStyles.unselected} onPress={closedPressed}>
          Closed
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
                <TransactionRow key={index} data={item} onPress={() => handleRowPress(index)} />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.bottomContainer} onPress={() => handleAddPressed()}>
            <View style={styles.ideasButton}>
              <Text style={styles.ideasText}>{'Add Transaction'}</Text>
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
