import { Fragment, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { getRecentActivityData } from './api';
import { RecentActivityDataProps } from './interfaces';
import React from 'react';
import RecentActivityRow from './RecentActivityRow';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';

export default function RecentActivityScreenScreen() {
  const filters = {
    All: 'all',
    Calls: 'calls',
    Notes: 'notes',
    'Pop-Bys': 'popbys',
    Referrals: 'referrals',
    Other: 'other',
  };

  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('all');
  const [dataActivity, setdataActivity] = useState<RecentActivityDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');

  const actionSheetRef = useRef<ActionSheet>(null);

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  const handleRowPress = (index: number) => {
    ga4Analytics('Recent_Activity_Row', {
      contentType: 'none',
      itemId: 'id0603',
    });
    navigation.navigate('RelDetails', {
      contactId: dataActivity[index].ContactId,
      firstName: dataActivity[index].Name,
      lastName: '',
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation, lightOrDark]);

  useEffect(() => {
    fetchData();
  }, [filterSetting]);

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  function filterPressed() {
    ga4Analytics('Recent_Activity_Filter_Open', {
      contentType: 'none',
      itemId: 'id0601',
    });
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

  if (isLoading) {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorDark}>
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
                  <RecentActivityRow
                    //  filterFromAbove={filterSetting}
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
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
                          ga4Analytics('Recent_Activity_Filter_Choice', {
                            contentType: value,
                            itemId: 'id0602',
                          });
                        }}
                        style={globalStyles.listItemCell}
                      >
                        {/*  you can style the text in listItem */}
                        <Text style={globalStyles.listItem}>{key}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/*  Add a Small Footer at Bottom */}
                  <View style={styles.footer} />
                </ScrollView>
              </View>
            </ActionSheet>
          </React.Fragment>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  chevron: {
    marginRight: 20,
    marginTop: 15,
    height: 12,
    width: 20,
  },
  filter: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#1C6597',
  },
  scrollview: {
    width: '100%',
    padding: 12,
  },
  footer: {
    height: 50,
  },
});
