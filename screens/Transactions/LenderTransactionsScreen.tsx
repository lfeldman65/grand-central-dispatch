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
import { changeTxStatus } from './api';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { statusMenuNew } from './transactionHelpers';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

type TabType = 'potential' | 'active' | 'pending' | 'closed';

interface TransactionScreenProps {
  route: RouteProp<any>;
}

export default function LenderTransactionsScreen(props: TransactionScreenProps) {
  const [tabSelected, setTabSelected] = useState<TabType>(props.route.params?.defaultTab ?? 'potential');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lightOrDark, setLightOrDark] = useState('');
  const [data, setData] = useState<TransactionDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusChoice, setStatusChoice] = useState('potential');
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleRowPress = (index: number) => {
    ga4Analytics('Lender_Transactions_Row', {
      contentType: tabSelected,
      itemId: 'id0905',
    });
    console.log(data[index].id);
    navigation.navigate('LenderTxDetails', {
      dealID: data[index].id,
      lightOrDark: lightOrDark,
    });
  };

  const handleAddPressed = () => {
    storage.setItem('whoCalledTxMenu', 'LenderTransactions');
    console.log('well here i am');
    navigation.navigate('AddTxMenu', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
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

  function tabPressed(type: TabType) {
    var mainEvent = 'Lender_Transactions_' + type;
    ga4Analytics(mainEvent, {
      contentType: 'none',
      itemId: getItemId(type),
    });
    setTabSelected(type);
    //no need to call fetch data here, the useEffect will automatically call fetchData
  }

  function getItemId(whichTab: string) {
    if (whichTab == 'Potential') return 'id0901';
    if (whichTab == 'Active') return 'id0902';
    if (whichTab == 'Pending') return 'id0903';
    return 'id0904';
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
    fetchData(tabSelected, 'Lender');
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
  }, [navigation, lightOrDark]);

  useEffect(() => {
    fetchData(tabSelected, 'Lender');
  }, [isFocused]);

  const changeStatusPressed = (dealId: number) => {
    const options = statusMenuNew;
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
          console.log('selected:' + options[selectedIndex!]);
          setStatusChoice(options[selectedIndex!]);
          continueTxChangeStatus(dealId, options[selectedIndex!], changeStatusSuccess, changeStatusFailure);
          ga4Analytics('Lender_Transactions_Swipe', {
            contentType: options[selectedIndex!],
            itemId: 'id0906',
          });
        }
      }
    );
  };

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
    fetchData(tabSelected, 'Lender');
  }

  function changeStatusFailure() {
    setIsLoading(false);
    console.log('changeStatusFailure');
    fetchData(tabSelected, 'Lender');
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
