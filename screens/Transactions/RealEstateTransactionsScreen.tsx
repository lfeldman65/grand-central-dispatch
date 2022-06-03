import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Event } from 'expo-analytics';
// import Swipeable from 'react-native-swipeable-row';
import TransactionRow from './TransactionRow';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import { getTransactionData } from './api';
import { TransactionDataProps } from './interfaces';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { changeTxStatus } from './api';

type TabType = 'potential' | 'active' | 'pending' | 'closed';

interface TransactionScreenProps {
  route: RouteProp<any>;
}

export default function RealEstateTransactionsScreen(props: TransactionScreenProps) {
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
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [data, setData] = useState<TransactionDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const actionSheetRef = useRef<ActionSheet>(null);
  const [statusChoice, setStatusChoice] = useState('potential');

  const [currentId, setCurrentId] = useState(0);

  const handleRowPress = (index: number) => {
    //  analytics.event(new Event('Real Estate Transactions', 'Row Pressed'));
    console.log(data[index].id);
    navigation.navigate('RealEstateTxDetails', {
      dealID: data[index].id,
    });
  };

  const handleAddPressed = () => {
    console.log('Add');
    analytics.event(new Event('Transactions', 'Add Transaction'));
    // if (tabSelected == 'calls') {
    //   setModalCallsVisible(!modalCallsVisible);
    // } else if (tabSelected == 'notes') {
    //   setModalNotesVisible(!modalNotesVisible);
    // } else if (tabSelected == 'popby') {
    //   setModalPopVisible(!modalPopVisible);
    // }
  };

  function tabPressed(type: TabType) {
    analytics.event(new Event('Real Estate Trans', type));
    setTabSelected(type);
    //no need to call fetch data here, the useEffect will automatically call fetchData
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

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  //anytime that setTabSelected is called, fetchData will also be called
  useEffect(() => {
    fetchData(tabSelected, 'Realtor');
  }, [tabSelected]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    fetchData(tabSelected, 'Realtor');
  }, [isFocused]);

  function filterPressed() {
    //console.log('filter press');
    SheetManager.show(Sheets.filterSheet);
  }

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
    fetchData(tabSelected, 'Realtor');
  }

  function changeStatusFailure() {
    setIsLoading(false);
    console.log('changeStatusFailure');
    fetchData(tabSelected, 'Realtor');
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {data.map((item, index) => (
              <View key={index}>
                <TransactionRow
                  key={index}
                  data={item}
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
                        // fetchData();
                      }}
                      style={styles2.listItemCell}
                    >
                      {/*  you can style the text in listItem */}
                      <Text style={styles2.listItem}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/*  Add a Small Footer at Bottom */}
                <View style={styles2.footer} />
              </ScrollView>
            </View>
          </ActionSheet>
        </React.Fragment>
      )}
    </View>
  );
}

const styles2 = StyleSheet.create({
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
