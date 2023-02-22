import React, { useState, useEffect, useRef } from 'react';
import { Modal, Image, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import TransactionRow from './TransactionRow';
import { styles } from './styles';
import { getTransactionData } from './api';
import { TransactionDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { changeTxStatus } from './api';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
type TabType = 'potential' | 'active' | 'pending' | 'closed';

interface TransactionScreenProps {
  route: RouteProp<any>;
}

export default function OtherTransactionsScreen(props: TransactionScreenProps) {
  // console.log('route param defaultTab', props.route.params?.defaultTab);
  const filters = {
    Potential: 'potential',
    Active: 'active',
    Pending: 'pending',
    Closed: 'closed',
  };

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'potential');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lightOrDark, setLightOrDark] = useState('');
  const [data, setData] = useState<TransactionDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [statusChoice, setStatusChoice] = useState('potential');
  const [currentId, setCurrentId] = useState(0);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const handleRowPress = (index: number) => {
    ga4Analytics('Other_Transactions_Row', {
      contentType: tabSelected,
      itemId: 'id1005',
    });
    console.log(data[index].id);
    navigation.navigate('OtherTxDetails', {
      dealID: data[index].id,
      lightOrDark: lightOrDark,
    });
  };

  const handleAddPressed = () => {
    console.log('Add');
    //   analytics.event(new Event('Transactions', 'Add Transaction'));
    storage.setItem('whoCalledTxMenu', 'OtherTransactions');
    navigation.navigate('AddTxMenu', {
      person: null,
      source: 'Transactions',
    });
  };

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
  }

  function tabPressed(type: TabType) {
    var mainEvent = 'Other_Transactions_' + type;
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: getItemId(type),
    });
    setTabSelected(type);
    //no need to call fetch data here, the useEffect will automatically call fetchData
  }

  function getItemId(whichTab: string) {
    if (whichTab == 'Potential') return 'id1001';
    if (whichTab == 'Active') return 'id1002';
    if (whichTab == 'Pending') return 'id1003';
    return 'id1004';
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

  //anytime that setTabSelected is called, fetchData will also be called
  useEffect(() => {
    fetchData(tabSelected, 'Other');
  }, [tabSelected]);

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
  });

  useEffect(() => {
    fetchData(tabSelected, 'Other');
  }, [isFocused]);

  function changeStatusPressed(dealId: number) {
    //console.log('filter press');
    setCurrentId(dealId);
    SheetManager.show(Sheets.filterSheet);
  }

  function continueTxChangeStatus(dealId: number, type: string, onSuccess: any, onFailure: any) {
    console.log('Type: ' + type);
    changeTxStatus(dealId, type)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
          onFailure();
        } else {
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure();
        console.log('complete error' + error);
      });
  }

  function changeStatusSuccess() {
    console.log('changeStatusSuccess');
    setIsLoading(false);
    fetchData(tabSelected, 'Other');
  }

  function changeStatusFailure() {
    setIsLoading(false);
    console.log('changeStatusFailure');
    fetchData(tabSelected, 'Other');
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={globalStyles.tabButtonRow}>
        <Text
          style={tabSelected == 'potential' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('potential')}
        >
          Potential
        </Text>
        <Text
          style={tabSelected == 'active' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('active')}
        >
          Active
        </Text>
        <Text
          style={tabSelected == 'pending' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('pending')}
        >
          Pending
        </Text>
        <Text
          style={tabSelected == 'closed' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('closed')}
        >
          Closed
        </Text>
      </View>

      {isLoading ? (
        <>
          <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
          <View
            style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}
          >
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        </>
      ) : (
        <>
          <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
          <React.Fragment>
            <ScrollView>
              {data.map((item, index) => (
                <View key={index}>
                  <TransactionRow
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                    refresh={() => tabPressed('potential')}
                    onChangeStatus={() => changeStatusPressed(item.id)}
                  />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.bottomContainer} onPress={() => handleAddPressed()}>
              <View style={styles.addButton}>
                <Text style={styles.addText}>{'Add Transaction'}</Text>
              </View>
            </TouchableOpacity>
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
              bottomOffset={10}
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
                  style={styles2.scrollview}
                >
                  <View>
                    {Object.entries(filters).map(([key, value]) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => {
                          SheetManager.hide(Sheets.filterSheet, null);
                          setStatusChoice(value);
                          continueTxChangeStatus(currentId, value, changeStatusSuccess, changeStatusFailure);
                          ga4Analytics('Other_Transactions_Swipe', {
                            contentType: value,
                            itemId: 'id1006',
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
                  <View style={styles2.footer} />
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
        </>
      )}
    </View>
  );
}

const styles2 = StyleSheet.create({
  scrollview: {
    width: '100%',
    padding: 12,
  },
  footer: {
    height: 50,
  },
});
