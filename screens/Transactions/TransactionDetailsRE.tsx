import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { TransactionDetailsProps } from './interfaces';
import { getTransactionDetails, deleteTx } from './api';
import { isNullOrEmpty } from '../../utils/general';
import { prettyDate } from '../../utils/general';
import { roundToInt } from './transactionHelpers';

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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={editPressed}>
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
    navigation.setOptions({ title: 'Transaction Details' });
  }, [navigation, data]);

  function editPressed() {
    console.log('edit pressed');
    navigation.navigate('AddOrEditRealtorTx1', {
      data: data,
      buyerOrSeller: data?.transactionType,
    });
  }

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchDetails(dealID, isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
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

  function handlePersonPressed(index: number) {
    navigation.navigate('RelDetails', {
      contactId: data?.contacts[index].userID,
      firstName: data?.contacts[index].contactName,
      lastName: '',
      //   rankFromAbove: 'C',
      //   qualFromAbove: true,
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

  function fetchDetails(dealID: string, isMounted: boolean) {
    setIsLoading(true);
    getTransactionDetails(dealID)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          //   console.log(res);
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
      {data?.contacts.map((item, index) => (
        <TouchableOpacity onPress={() => handlePersonPressed(index)}>
          <View style={styles.referralAndSpouseRow}>
            <View style={styles.referralAndSpouseText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{item.contactName}</Text>
            </View>

            {!isNullOrEmpty(data?.contacts[index].userID) && (
              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      {!isNullOrEmpty(data?.contacts[0].leadSource) && <Text style={styles.header}>{'Lead Source'}</Text>}
      {!isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[0].leadSource}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'Street 1'}</Text>}
      {data?.address.street != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'Street 2'}</Text>}
      {data?.address.street != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street2}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'City'}</Text>}
      {data?.address.street != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.city}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'State / Province'}</Text>}
      {data?.address.street != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.state}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'Zip / Postal Code'}</Text>}
      {data?.address.street != '' && (
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

      {!isNullOrEmpty(data?.sellerCommission) && data?.sellerCommission != '0' && (
        <Text style={styles.header}>{"Seller's Commission"}</Text>
      )}
      {!isNullOrEmpty(data?.sellerCommission) && data?.sellerCommission != '0' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.sellerCommission!, data?.sellerCommissionType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.buyerCommission) && data?.buyerCommission != '0' && (
        <Text style={styles.header}>{"Buyer's Commission"}</Text>
      )}
      {!isNullOrEmpty(data?.buyerCommission) && data?.buyerCommission != '0' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.buyerCommission!, data?.buyerCommissionType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.additionalIncome) && <Text style={styles.header}>{'Additional Income'}</Text>}
      {!isNullOrEmpty(data?.additionalIncome) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.additionalIncome!, data?.additionalIncomeType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.grossCommision) && (
        <View style={styles.boxRow}>
          <Text style={styles.largeHeader}>My Gross Commission</Text>
          <Text style={lightOrDark == 'dark' ? styles.boxTextDark : styles.boxTextLight}>
            {formatDollarOrPercent(roundToInt(data?.grossCommision!), 'dollar')}
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
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
