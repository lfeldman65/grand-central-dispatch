import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import PACCallsRow from './PACCallsRow';
import PACNotesRow from './PACNotesRow';
import PACPopRow from './PACPopRow';
import { styles } from './styles';
import { getPACData } from './api';
import { PACDataProps } from './interfaces';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

type TabType = 'calls' | 'notes' | 'popby';

interface PACScreenProps {
  route: RouteProp<any>;
}

export default function PACScreen(props: PACScreenProps) {
  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'calls');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalCallsVisible, setModalCallsVisible] = useState(false);
  const [modalNotesVisible, setModalNotesVisible] = useState(false);
  const [modalPopVisible, setModalPopVisible] = useState(false);
  const [lightOrDark, setLightOrDark] = useState('light');
  const [data, setData] = useState<PACDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const handleRowPress = (index: number) => {
    rowAnalytics();
    navigation.navigate('PACDetail', {
      contactId: data[index]['contactId'],
      type: data[index]['type'],
      ranking: data[index]['ranking'],
      lastCallDate: data[index]['lastCallDate'],
      lastNoteDate: data[index]['lastNoteDate'],
      lastPopByDate: data[index]['lastPopByDate'],
      lightOrDark: lightOrDark,
    });
  };

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  }

  function rowAnalytics() {
    var mainEvent = 'Error';
    var itemID = 'id9999';
    if (tabSelected == 'calls') {
      mainEvent = 'PAC_Calls_Row';
      itemID = 'id0404';
    } else if (tabSelected == 'notes') {
      mainEvent = 'PAC_Notes_Row';
      itemID = 'id0405';
    } else if (tabSelected == 'popby') {
      mainEvent = 'PAC_Pop_By_Row';
      itemID = 'id0406';
    }
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: itemID,
    });
  }

  const handleIdeasPressed = () => {
    var contentType = 'Error';
    if (tabSelected == 'calls') {
      var contentType = 'Calls';
      setModalCallsVisible(!modalCallsVisible);
    } else if (tabSelected == 'notes') {
      var contentType = 'Notes';
      setModalNotesVisible(!modalNotesVisible);
    } else if (tabSelected == 'popby') {
      var contentType = 'Pop_Bys';
      setModalPopVisible(!modalPopVisible);
    }
    ga4Analytics('PAC_View_Ideas', {
      contentType: contentType,
      itemId: 'id0407',
    });
  };

  function callsPressed() {
    ga4Analytics('PAC_Calls_Tab', {
      contentType: 'none',
      itemId: 'id0401',
    });
    setTabSelected('calls');
    fetchData('calls', true);
  }

  function notesPressed() {
    ga4Analytics('PAC_Notes_Tab', {
      contentType: 'none',
      itemId: 'id0402',
    });
    setTabSelected('notes');
    fetchData('notes', true);
  }

  function popPressed() {
    ga4Analytics('PAC_Pop_By_Tab', {
      contentType: 'none',
      itemId: 'id0403',
    });
    setTabSelected('popby');
    fetchData('popby', true);
  }

  function fetchData(type: string, isMounted: boolean) {
    setIsLoading(true);
    getPACData(type)
      .then((res) => {
        if (!isMounted) {
          return;
        }
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
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    fetchData(tabSelected, isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
        <View style={globalStyles.tabButtonRow}>
          <Text style={tabSelected == 'calls' ? globalStyles.selected : globalStyles.unselected} onPress={callsPressed}>
            Calls
          </Text>
          <Text style={tabSelected == 'notes' ? globalStyles.selected : globalStyles.unselected} onPress={notesPressed}>
            Notes
          </Text>
          <Text style={tabSelected == 'popby' ? globalStyles.selected : globalStyles.unselected} onPress={popPressed}>
            {'Pop-Bys'}
          </Text>
        </View>

        {isLoading ? (
          <View
            style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}
          >
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        ) : (
          <React.Fragment>
            <ScrollView>
              {data.map((item, index) => (
                <View key={index}>
                  {tabSelected == 'calls' ? (
                    <PACCallsRow
                      key={index}
                      data={item}
                      onPress={() => handleRowPress(index)}
                      refresh={() => callsPressed()}
                      lightOrDark={lightOrDark}
                      close={(s) => {
                        data.forEach((item) => {
                          if (item.swipeRef != null && item.swipeRef != s) item.swipeRef.close();
                          item.swipeRef = null;
                        });
                      }}
                    />
                  ) : null}
                  {tabSelected == 'notes' ? (
                    <PACNotesRow
                      key={index}
                      data={item}
                      onPress={() => handleRowPress(index)}
                      refresh={() => notesPressed()}
                      lightOrDark={lightOrDark}
                      close={(s) => {
                        data.forEach((item) => {
                          if (item.swipeRef != null && item.swipeRef != s) item.swipeRef.close();
                          item.swipeRef = null;
                        });
                      }}
                    />
                  ) : null}
                  {tabSelected == 'popby' ? (
                    <PACPopRow
                      key={index}
                      data={item}
                      onPress={() => handleRowPress(index)}
                      refresh={() => popPressed()}
                      lightOrDark={lightOrDark}
                      close={(s) => {
                        data.forEach((item) => {
                          if (item.swipeRef != null && item.swipeRef != s) item.swipeRef.close();
                          item.swipeRef = null;
                        });
                      }}
                    />
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
                <IdeasCalls lightOrDark={lightOrDark} setModalCallsVisible={setModalCallsVisible} />
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
                <IdeasNotes lightOrDark={lightOrDark} setModalNotesVisible={setModalNotesVisible} />
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
                <IdeasPop lightOrDark={lightOrDark} setModalPopVisible={setModalPopVisible} />
              </Modal>
            )}
          </React.Fragment>
        )}
      </View>
      {quickSearchVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={quickSearchVisible}
          onRequestClose={() => {
            setQuickSearchVisible(!quickSearchVisible);
          }}
        >
          <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
        </Modal>
      )}
    </>
  );
}
