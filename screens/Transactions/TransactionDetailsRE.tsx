import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { TransactionDetailsProps } from './interfaces';
import { getTransactionDetails, deleteTx } from './api';
import { isNullOrEmpty } from '../../utils/general';
import { prettyDate } from '../../utils/general';
import { Navigation } from 'react-native-feather';

const chevron = require('../../images/chevron_blue_right.png');

export default function TransactionDetailsRE(props: any) {
  const { route } = props;
  const { dealID } = route.params;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TransactionDetailsProps>();
  const navigation = useNavigation();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    fetchDetails(dealID);
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function deletePressed() {
    console.log('delete pressed');
    deleteTrans(dealID);
  }
  function handleBuyerPressed() {
    console.log('buyer');
  }

  function formatDollarOrPercent(amount: string, type: string) {
    if (type == 'percent') return amount + '%';
    return '$' + amount;
  }

  function deleteTrans(dealID: number) {
    setIsLoading(true);
    console.log('delete Pressed');
    //navigation.goBack();
    deleteTx(dealID)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res);
          navigation.goBack();
        }
      })
      .catch((error: any) => {
        console.log('complete error' + error);
      });
  }

  function fetchDetails(dealID: string) {
    setIsLoading(true);
    getTransactionDetails(dealID)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          console.log(res);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}></ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 14,
    color: 'gray',
  },
  largeHeader: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 16,
    color: 'gray',
  },
  textDark: {
    paddingTop: 5,
    marginLeft: 20,
    fontSize: 18,
    color: 'white',
  },
  textLight: {
    paddingTop: 5,
    marginLeft: 20,
    fontSize: 18,
    color: 'black',
  },
  boxTextDark: {
    paddingTop: 10,
    marginLeft: 20,
    fontSize: 18,
    color: 'white',
    paddingRight: 10,
  },
  boxTextLight: {
    paddingTop: 5,
    marginLeft: 20,
    fontSize: 18,
    color: 'black',
  },
  chevronBox: {
    alignContent: 'flex-end',
  },
  chevron: {
    height: 18,
    width: 10,
  },
  referralAndSpouseRow: {
    flexDirection: 'row',
    height: 30,
  },
  referralAndSpouseText: {
    height: 25,
    width: '92%',
    textAlign: 'left',
  },
  boxRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    paddingBottom: 10,
    marginTop: 10,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
});
