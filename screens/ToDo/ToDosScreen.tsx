import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { getToDoData } from './api';
import { ToDoDataProps } from './interfaces';
import React from 'react';
import ToDoRow from './ToDoRow';
import globalStyles from '../../globalStyles';
import AddToDo from './AddToDoScreen';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { toDoFilters } from './toDoHelpers';
const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

export default function ToDosScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('All');
  const [dataActivity, setdataActivity] = useState<ToDoDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleRowPress = (index: number) => {
    ga4Analytics('To_Do_Row', {
      contentType: 'none',
      itemId: 'id1203',
    });
    navigation.navigate('toDoDetails', {
      toDoID: dataActivity[index].id,
      lightOrDark: lightOrDark,
    });
  };

  useEffect(() => {
    fetchData(true);
  }, [filterSetting]);

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
  }, [navigation, lightOrDark]);

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

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

  function addNewToDoPressed() {
    ga4Analytics('To_Do_Add_New', {
      contentType: 'none',
      itemId: 'id1204',
    });
    setModalVisible(true);
  }

  const filterPressed = () => {
    ga4Analytics('To_Do_Filter_Open', {
      contentType: 'none',
      itemId: 'id1201',
    });
    const options = toDoFilters;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          setFilterSetting(options[selectedIndex!]);
        }
      }
    );
  };

  function convertToParam(prettyFilter: string) {
    if (prettyFilter == 'All') {
      return 'all';
    }
    if (prettyFilter == 'Today') {
      return '0';
    }
    if (prettyFilter == 'Week') {
      return '7';
    }
    if (prettyFilter == 'Month') {
      return '30';
    }
    if (prettyFilter == 'Overdue') {
      return 'overdue';
    }
    if (prettyFilter == 'Completed') {
      return 'completed';
    }
    return 'Error';
  }

  function saveComplete() {
    fetchData(true);
  }

  function fetchData(isMounted: boolean) {
    console.log('FETCHDATA');
    setIsLoading(true);
    getToDoData(convertToParam(filterSetting))
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setdataActivity(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  if (isLoading) {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>

        <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
          <React.Fragment>
            <TouchableOpacity onPress={filterPressed}>
              <View style={globalStyles.filterRow}>
                <Text style={globalStyles.filterText}>{filterSetting}</Text>
              </View>
            </TouchableOpacity>

            <ScrollView>
              <View>
                {dataActivity.map((item, index) => (
                  <ToDoRow
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                    refresh={() => fetchData(true)}
                    close={(s) => {
                      dataActivity.forEach((item) => {
                        if (item.swipeRef != null && item.swipeRef != s) item.swipeRef.close();
                        item.swipeRef = null;
                      });
                    }}
                  />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.bottomContainer} onPress={() => addNewToDoPressed()}>
              <View style={styles.ideasButton}>
                <Text style={styles.ideasText}>{'Add To Do'}</Text>
              </View>
            </TouchableOpacity>

            {modalVisible && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <AddToDo
                  title={'New To Do'}
                  lightOrDark={lightOrDark}
                  onSave={saveComplete}
                  setModalVisible={setModalVisible}
                />
              </Modal>
            )}

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
          </React.Fragment>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {
    width: '100%',
    padding: 12,
  },
  footer: {
    height: 50,
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
  },
  ideasButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  ideasText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    // justifyContent: 'center',
    marginBottom: 12,
  },
});
