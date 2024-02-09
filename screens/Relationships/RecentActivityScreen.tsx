import { useState } from 'react';
import { StyleSheet, Text, Image, View, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { getRecentActivityData } from './api';
import { RecentActivityDataProps } from './interfaces';
import React from 'react';
import RecentActivityRow from './RecentActivityRow';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { recentActivityFilters } from './relationshipHelpers';

const quickAdd = require('../../images/addWhite.png');
const searchGlass = require('../../images/whiteSearch.png');

export default function RecentActivityScreenScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [filterSetting, setFilterSetting] = useState('all');
  const [dataActivity, setdataActivity] = useState<RecentActivityDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const Sheets = {
    filterSheet: 'filter_sheet_id',
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

  const handleRowPress = (index: number) => {
    ga4Analytics('Recent_Activity_Row', {
      contentType: 'none',
      itemId: 'id0603',
    });
    navigation.navigate('RelDetails', {
      contactId: dataActivity[index].ContactId,
      firstName: dataActivity[index].Name,
      lastName: '',
      lightOrDark: lightOrDark,
    });
  };

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
    fetchData();
  }, [filterSetting]);

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const filterPressed = () => {
    ga4Analytics('Recent_Activity_Filter_Open', {
      contentType: 'none',
      itemId: 'id0601',
    });
    const options = recentActivityFilters;
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

  function filterToParam(filter: string) {
    console.log(filter);
    if (filter == 'All') {
      return 'all';
    }
    if (filter == 'Calls') {
      return 'calls';
    }
    if (filter == 'Notes') {
      return 'notes';
    }
    if (filter == 'Pop-Bys') {
      return 'popbys';
    }
    if (filter == 'Referral') {
      return 'referrals';
    }
    return 'other';
  }

  function fetchData() {
    setIsLoading(true);
    getRecentActivityData(filterToParam(filterSetting))
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
            <TouchableOpacity onPress={filterPressed}>
              <View style={globalStyles.filterRow}>
                <Text style={globalStyles.filterText}>{filterSetting}</Text>
              </View>
            </TouchableOpacity>

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
          </React.Fragment>
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
