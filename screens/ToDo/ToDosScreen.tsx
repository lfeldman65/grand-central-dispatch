import { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
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

import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
const chevron = require('../../images/chevron_blue.png');

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

  const actionSheetRef = useRef<ActionSheet>(null);

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  const handleRowPress = (index: number) => {
    console.log('to do row press');
    analytics.event(new Event('To-Do', 'Go To Details', 'Press', 0));

    // navigation.navigate('RelationshipDetailScreen', {});
    // navigation.navigate('RelationshipDetailScreen', {
    //   //  contactId: data[index]['contactId'],
    // });
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [filterSetting]);

  //useEffect(() => {}); // this will run on every render

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

  // function saveComplete() {
  //   console.log('Save Complete');
  // }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <View style={globalStyles.filterRow}>
            <Text style={globalStyles.blankButton}></Text>
            <TouchableOpacity onPress={filterPressed}>
              <Text style={globalStyles.filterText}>{prettyFilter(filterSetting)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={filterPressed}>
              <Image source={chevron} style={globalStyles.chevronFilter} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View>
              {dataActivity.map((item, index) => (
                <ToDoRow key={index} data={item} onPress={() => handleRowPress(index)} />
              ))}
            </View>
          </ScrollView>
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
                      {/*  you can style the text in listItem */}
                      <Text style={styles.listItem}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/*  Add a Small Footer at Bottom */}
                <View style={styles.footer} />
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
});
