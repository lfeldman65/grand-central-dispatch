import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
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

type TabType = 'Potential' | 'Active' | 'Pending' | 'Closed';

interface TransactionScreenProps {
  route: RouteProp<any>;
}

export default function RealEstateTransactionsScreen(props: TransactionScreenProps) {
  // console.log('route param defaultTab', props.route.params?.defaultTab);
  const filters = {
    Potential: 'Potential',
    Active: 'Active',
    Pending: 'Pending',
    Closed: 'Closed',
  };

  const Sheets = {
    filterSheet: 'filter_sheet_id',
  };

  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'Potential');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lightOrDark, setLightOrDark] = useState('');
  const [data, setData] = useState<TransactionDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [statusChoice, setStatusChoice] = useState('Potential');
  const [currentId, setCurrentId] = useState(0);

  const handleRowPress = (index: number) => {
    ga4Analytics('Realtor_Transactions_Row', {
      contentType: tabSelected,
      itemId: 'id0805',
    });
    navigation.navigate('RealEstateTxDetails', {
      dealID: data[index].id,
      lightOrDark: lightOrDark,
    });
  };

  const handleAddPressed = () => {
    ga4Analytics('Realtor_Transactions_Add', {
      contentType: 'none',
      itemId: 'id0807',
    });
    storage.setItem('whoCalledTxMenu', 'RealEstateTransactions');
    console.log('theme in RealEstateTransactionsScreen: ' + lightOrDark);
    navigation.navigate('AddTxMenu', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  };

  function tabPressed(type: TabType) {
    console.log(type);
    var mainEvent = 'Realtor_Transactions_' + type;
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: getItemId(type),
    });
    setTabSelected(type);
  }

  function getItemId(whichTab: string) {
    if (whichTab == 'Potential') return 'id0801';
    if (whichTab == 'Active') return 'id0802';
    if (whichTab == 'Pending') return 'id0803';
    return 'id0804';
  }

  function fetchData(status: string, type: string, isMounted: boolean) {
    setIsLoading(true);
    getTransactionData(status, type)
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
    let isMounted = true;
    fetchData(tabSelected, 'Realtor', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchData(tabSelected, 'Realtor', isMounted);
    return () => {
      isMounted = false;
    };
  }, [tabSelected]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation, lightOrDark]);

  function changeStatusPressed(dealId: number) {
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
    fetchData(tabSelected, 'Realtor', true);
  }

  function changeStatusFailure() {
    setIsLoading(false);
    console.log('changeStatusFailure');
    fetchData(tabSelected, 'Realtor', true);
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={globalStyles.tabButtonRow}>
        <Text
          style={tabSelected == 'Potential' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('Potential')}
        >
          Potential
        </Text>
        <Text
          style={tabSelected == 'Active' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('Active')}
        >
          Active
        </Text>
        <Text
          style={tabSelected == 'Pending' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('Pending')}
        >
          Pending
        </Text>
        <Text
          style={tabSelected == 'Closed' ? globalStyles.selected : globalStyles.unselected}
          onPress={() => tabPressed('Closed')}
        >
          Closed
        </Text>
      </View>

      {isLoading ? (
        <>
          <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                    refresh={() => tabPressed('Potential')}
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
                          ga4Analytics('Realtor_Transactions_Swipe', {
                            contentType: value,
                            itemId: 'id0806',
                          });
                        }}
                        style={globalStyles.listItemCell}
                      >
                        {/*  you can style the text in listItem */}
                        <Text style={globalStyles.listItem}>{key}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ActionSheet>
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
});
