import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { getToDoData } from './api';
import { ToDoDataProps } from './interfaces';
import React from 'react';
import ToDoRow from './ToDoRow';
import globalStyles from '../../globalStyles';
import AddToDo from './AddToDoScreen';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

export default function ToDosScreen() {
  const filters = {
    All: 'all',
    Today: '0',
    Week: '7',
    Month: '30',
    Overdue: 'overdue',
    Completed: 'completed',
  };

  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('all');
  const [dataActivity, setdataActivity] = useState<ToDoDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const actionSheetRef = useRef<ActionSheet>(null);

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

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

  function filterPressed() {
    ga4Analytics('To_Do_Filter_Open', {
      contentType: 'none',
      itemId: 'id1201',
    });
    SheetManager.show(Sheets.filterSheet);
  }

  function prettyFilter(uglyFilter: string) {
    if (uglyFilter == 'all') {
      return 'All';
    }
    if (uglyFilter == '0') {
      return 'Today';
    }
    if (uglyFilter == '7') {
      return 'Week';
    }
    if (uglyFilter == '30') {
      return 'Month';
    }
    if (uglyFilter == 'overdue') {
      return 'Overdue';
    }
    if (uglyFilter == 'completed') {
      return 'Completed';
    }
    return 'Error';
  }

  function saveComplete() {
    fetchData(true);
  }

  function fetchData(isMounted: boolean) {
    setIsLoading(true);
    getToDoData(filterSetting)
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
            <View style={globalStyles.filterRow}>
              <TouchableOpacity onPress={filterPressed}>
                <Text style={globalStyles.filterText}>{prettyFilter(filterSetting)}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View>
                {dataActivity.map((item, index) => (
                  <ToDoRow key={index} data={item} lightOrDark={lightOrDark} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.bottomContainer} onPress={() => addNewToDoPressed()}>
              <View style={styles.ideasButton}>
                <Text style={styles.ideasText}>{'Add New To-Do'}</Text>
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
                  title={'New To-Do'}
                  lightOrDark={lightOrDark}
                  onSave={saveComplete}
                  setModalVisible={setModalVisible}
                />
              </Modal>
            )}
            <ActionSheet
              initialOffsetFromBottom={10}
              onBeforeShow={(data) => console.log('action sheet')}
              id={Sheets.filterSheet}
              ref={actionSheetRef}
              statusBarTranslucent
              bounceOnOpen={true}
              drawUnderStatusBar={true}
              bounciness={4}
              gestureEnabled={true}
              bottomOffset={40}
              defaultOverlayOpacity={0.3}
            >
              <View
                style={{
                  paddingHorizontal: 12,
                }}
              >
                <ScrollView
                  nestedScrollEnabled
                  onMomentumScrollEnd={() => {
                    actionSheetRef.current?.handleChildScrollEnd();
                  }}
                  style={styles.scrollview}
                >
                  <View>
                    {Object.entries(filters).map(([index, value]) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          SheetManager.hide(Sheets.filterSheet, null);
                          setFilterSetting(value);
                          ga4Analytics('To_Do_Filter_Choice', {
                            contentType: prettyFilter(value),
                            itemId: 'id1202',
                          });
                        }}
                        style={globalStyles.listItemCell}
                      >
                        <Text style={globalStyles.listItem}>{index}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/*  Add a Small Footer at Bottom */}
                </ScrollView>
              </View>
            </ActionSheet>
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
