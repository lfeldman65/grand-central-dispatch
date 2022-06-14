import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { TransactionDetailsProps } from './interfaces';
import { getTransactionDetails, deleteTx } from './api';
import { isNullOrEmpty } from '../../utils/general';
import { prettyDate } from '../../utils/general';
import { Navigation } from 'react-native-feather';

const chevron = require('../../images/chevron_blue_right.png');

export default function TransactionDetailsLender(props: any) {
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
    Alert.alert(
      'Are you sure you want to delete this Transaction?',
      '',
      [
        {
          text: 'Delete',
          onPress: () => deleteTrans(dealID),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }
  function handleBuyerPressed() {
    navigation.navigate('RelDetails', {
      contactId: data?.contacts[0].userID,
      firstName: data?.contacts[0].contactName,
      lastName: '',
    });
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
    <ScrollView style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <Text style={styles.header}>{'Transaction Type'}</Text>
      <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.transactionType}</Text>
      <Text style={styles.header}>{'Status'}</Text>
      <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.status}</Text>

      {!isNullOrEmpty(data?.contacts[0].userID) && <Text style={styles.header}>Buyer</Text>}
      {true && (
        <TouchableOpacity onPress={() => handleBuyerPressed()}>
          <View style={styles.referralAndSpouseRow}>
            <View style={styles.referralAndSpouseText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
                {data?.contacts[0].contactName}
              </Text>
            </View>

            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {!isNullOrEmpty(data?.contacts[0].leadSource) && <Text style={styles.header}>{'Lead Source'}</Text>}
      {!isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[0].leadSource}</Text>
      )}

      {data?.address.street == 'TBD' && <Text style={styles.header}>{'Address'}</Text>}
      {data?.address.street == 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street}</Text>
      )}

      {data?.address.street != 'TBD' && <Text style={styles.header}>{'Street 1'}</Text>}
      {data?.address.street != 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street}</Text>
      )}

      {data?.address.street != 'TBD' && <Text style={styles.header}>{'Street 2'}</Text>}
      {data?.address.street != 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street2}</Text>
      )}

      {data?.address.street != 'TBD' && <Text style={styles.header}>{'City'}</Text>}
      {data?.address.street != 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.city}</Text>
      )}

      {data?.address.street != 'TBD' && <Text style={styles.header}>{'State / Province'}</Text>}
      {data?.address.street != 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.state}</Text>
      )}

      {data?.address.street != 'TBD' && <Text style={styles.header}>{'Zip / Postal Code'}</Text>}
      {data?.address.street != 'TBD' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.zip}</Text>
      )}

      {!isNullOrEmpty(data?.probabilityToClose) && <Text style={styles.header}>{'Probability to Close'}</Text>}
      {!isNullOrEmpty(data?.probabilityToClose) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.probabilityToClose}</Text>
      )}

      {!isNullOrEmpty(data?.projectedAmount) && <Text style={styles.header}>{'Closing Price (Projected)'}</Text>}
      {!isNullOrEmpty(data?.projectedAmount) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{'$' + data?.projectedAmount}</Text>
      )}

      {!isNullOrEmpty(data?.closingDate) && <Text style={styles.header}>{'Closing Date (Projected)'}</Text>}
      {!isNullOrEmpty(data?.closingDate) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{prettyDate(data?.closingDate!)}</Text>
      )}

      {!isNullOrEmpty(data?.interestRate) && <Text style={styles.header}>{'Interest Rate'}</Text>}
      {!isNullOrEmpty(data?.interestRate) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.interestRate!, 'percent')}
        </Text>
      )}

      {!isNullOrEmpty(data?.loanType) && <Text style={styles.header}>{'Loan Type'}</Text>}
      {!isNullOrEmpty(data?.loanType) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {data?.rateType + ' ' + data?.loanType}
        </Text>
      )}

      {!isNullOrEmpty(data?.sellerCommission) && <Text style={styles.header}>{"Seller's Commission"}</Text>}
      {!isNullOrEmpty(data?.sellerCommission) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.sellerCommission!, data?.sellerCommissionType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.buyerCommission) && <Text style={styles.header}>{"Buyer's Commission"}</Text>}
      {!isNullOrEmpty(data?.buyerCommission) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.buyerCommission!, data?.buyerCommissionType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.grossCommision) && <Text style={styles.header}>{'Additional Income'}</Text>}
      {!isNullOrEmpty(data?.grossCommision) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.grossCommision!, 'dollar')}
        </Text>
      )}

      {!isNullOrEmpty(data?.grossCommision) && (
        <View style={styles.boxRow}>
          <Text style={styles.largeHeader}>My Gross Commission</Text>
          <Text style={lightOrDark == 'dark' ? styles.boxTextDark : styles.boxTextLight}>
            {formatDollarOrPercent(data?.grossCommision!, 'dollar')}
          </Text>
        </View>
      )}

      {!isNullOrEmpty(data?.miscBeforeSplitFees) && <Text style={styles.header}>{'Misc Before-Split Fees'}</Text>}
      {!isNullOrEmpty(data?.miscBeforeSplitFees) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.miscBeforeSplitFees!, data?.miscBeforeSplitFeesType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.commissionPortion) && <Text style={styles.header}>{'My Portion of the Broker Split'}</Text>}
      {!isNullOrEmpty(data?.commissionPortion) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.commissionPortion!, data?.commissionPortionType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.miscAfterSplitFees) && <Text style={styles.header}>{'Misc After-Split Fees'}</Text>}
      {!isNullOrEmpty(data?.miscAfterSplitFees) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.miscAfterSplitFees!, data?.miscAfterSplitFeesType!)}
        </Text>
      )}

      <View style={styles.boxRow}>
        <Text style={styles.largeHeader}>{"Income After Broker's Split and Fees"}</Text>
        <Text style={lightOrDark == 'dark' ? styles.boxTextDark : styles.boxTextLight}>
          {formatDollarOrPercent(data?.incomeAfterSplitFees!, 'dollar')}
        </Text>
      </View>

      {!isNullOrEmpty(data?.notes) && <Text style={styles.header}>{'Notes'}</Text>}
      {!isNullOrEmpty(data?.notes) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.notes}</Text>
      )}

      <Text></Text>

      <TouchableOpacity onPress={deletePressed}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>

      <Text></Text>
    </ScrollView>
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
    paddingTop: 10,
    marginLeft: 20,
    fontSize: 18,
    color: 'black',
    paddingRight: 10,
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
