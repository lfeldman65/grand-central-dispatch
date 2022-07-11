import { Fragment, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { storage } from '../../utils/storage';
import { getToDoData } from './api';
import { ToDoDataProps } from './interfaces';
import { analytics } from '../../utils/analytics';
import React from 'react';
import ToDoRow from './ToDoRow';
import globalStyles from '../../globalStyles';
import AddToDo from './AddToDoScreen';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
const chevron = require('../../images/chevron_blue.png');

// AddNewToDoPressed
// Invoke AddToDo, pass in title (string) onSave (function) setModalVisible (function)
// AddToDoScreen receives props as const (setModalVisible, title, onSave) = props
// ToDosScreen executes the function

export default function ToDosScreen() {
  const filters = {
    All: 'all',
    Today: '0',
    Week: '7',
    Month: '30',
    Overdue: 'overdue',
    Completed: 'completed',
  };

  // const [tabSelected, setTabSelected] = useState(props.route.params?.defaultTab ?? 'A-Z');
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('all');
  const [dataActivity, setdataActivity] = useState<ToDoDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const actionSheetRef = useRef<ActionSheet>(null);

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (index: number) => {
    console.log('to do row press');
    //  analytics.event(new Event('To-Do', 'Go To Details', 'Press', 0));

    navigation.navigate('toDoDetails', {
      toDoID: dataActivity[index].id,
    });
  };

  useEffect(() => {
    fetchData();
  }, [filterSetting]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
    getDarkOrLightMode();
    fetchData();
  }, [isFocused]);

  //useEffect(() => {}); // this will run on every render

  function addNewToDoPressed() {
    //  analytics.event(new Event('To-Do', 'Add To-Do', 'Pressed', 0));
    console.log('Add To-Do Pressed');
    setModalVisible(true);
  }

  function filterPressed() {
    analytics.event(new Event('Recent Contact Activity', 'Filter', filterSetting, 0));
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
    // fetchRolodexPressed('alpha');
    console.log('save complete');
    fetchData();
  }

  function fetchData() {
    setIsLoading(true);
    getToDoData(filterSetting)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setdataActivity(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <View style={globalStyles.filterRow}>
            <TouchableOpacity onPress={filterPressed}>
              <Text style={globalStyles.filterText}>{prettyFilter(filterSetting)}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View>
              {dataActivity.map((item, index) => (
                <ToDoRow key={index} data={item} onPress={() => handleRowPress(index)} />
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
              <AddToDo title={'New To-Do'} onSave={saveComplete} setModalVisible={setModalVisible} />
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
                  {Object.entries(filters).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        SheetManager.hide(Sheets.filterSheet, null);
                        setFilterSetting(value);
                        // fetchData();
                      }}
                      style={styles.listItemCell}
                    >
                      <Text style={styles.listItem}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/*  Add a Small Footer at Bottom */}
              </ScrollView>
            </View>
          </ActionSheet>
        </React.Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
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
