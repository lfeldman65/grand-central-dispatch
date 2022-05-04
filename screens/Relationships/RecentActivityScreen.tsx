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
import Button from '../../components/Button';
import { getRecentActivityData } from './api';
import { RecentActivityDataProps } from './interfaces';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import RecentActivityRow from './RecentActivityRow';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';

const chevron = require('../../images/chevron_blue.png');

//type FilterOptions = 'all' | 'calls' | 'notes' | 'popbys' | 'referrals' | 'other';

// interface RolodexScreenProps {
//   route: RouteProp<any>;
// }

//export default function ManageRelationshipsScreen(props: RolodexScreenProps) {
export default function RecentActivityScreenScreen() {
  let deviceWidth = Dimensions.get('window').width;

  const filters = {
    All: 'all',
    Calls: 'calls',
    Notes: 'notes',
    'Pop-Bys': 'popbys',
    Referrals: 'referrals',
    Other: 'other',
  };

  // const [tabSelected, setTabSelected] = useState(props.route.params?.defaultTab ?? 'A-Z');
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('all');

  const [dataActivity, setdataActivity] = useState<RecentActivityDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  const actionSheetRef = useRef<ActionSheet>(null);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  const handleRowPress = (index: number) => {
    console.log('rolodex row press');
    analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));

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

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  //useEffect(() => {}); // this will run on every render

  function filterPressed() {
    analytics.event(new Event('Recent Contact Activity', 'Filter', filterSetting, 0));
    SheetManager.show(Sheets.filterSheet);
  }

  function prettyFilter(uglyFilter: string) {
    if (uglyFilter == 'all') {
      return 'All';
    }
    if (uglyFilter == 'calls') {
      return 'Calls';
    }
    if (uglyFilter == 'notes') {
      return 'Notes';
    }
    if (uglyFilter == 'popbys') {
      return 'Pop-Bys';
    }
    if (uglyFilter == 'referrals') {
      return 'Referrals';
    }
    return 'Other';
  }

  function fetchData() {
    setIsLoading(true);
    getRecentActivityData(filterSetting)
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
                <RecentActivityRow
                  //  filterFromAbove={filterSetting}
                  key={index}
                  data={item}
                  onPress={() => handleRowPress(index)}
                />
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
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  blankButton: {
    // Helps placement of title and chevron
    marginLeft: '10%',
  },
  chevron: {
    marginRight: 20,
    marginTop: 15,
    height: 12,
    width: 20,
  },
  filterButton: {
    height: 40,
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#1C6597',
    marginTop: 10,
  },
  filter: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#1C6597',
  },
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
  btnLeft: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
  },
});
