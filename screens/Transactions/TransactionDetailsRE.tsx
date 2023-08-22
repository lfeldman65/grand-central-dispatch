import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { TransactionDetailsProps } from './interfaces';
import { getTransactionDetails, deleteTx } from './api';
import { isNullOrEmpty } from '../../utils/general';
import { prettyDate } from '../../utils/general';
import { roundToInt } from './transactionHelpers';
import { ga4Analytics } from '../../utils/general';

const chevron = require('../../images/chevron_blue_right.png');
const fontSize = 16;

export default function TransactionDetailsRE(props: any) {
  const { route } = props;
  const { dealID, lightOrDark } = route.params;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TransactionDetailsProps>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Transaction Details',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={editPressed}>
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  function editPressed() {
    ga4Analytics('Realtor_Transactions_Edit', {
      contentType: 'none',
      itemId: 'id0808',
    });
    navigation.navigate('AddOrEditRealtorTx1', {
      data: data,
    });
  }

  useEffect(() => {
    console.log('street1: ' + data?.address.street);
    let isMounted = true;
    fetchDetails(dealID, isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

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
      lightOrDark: lightOrDark,
    });
  }

  function formatDollarOrPercent(amount: string, type: string) {
    if (type == 'percent') return amount + '%';
    return '$' + amount;
  }

  function deleteTrans(dealID: number) {
    setIsLoading(true);
    console.log('delete Pressed');
    deleteTx(dealID)
      .then((res) => {
        //  console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          ga4Analytics('Realtor_Transactions_Delete', {
            contentType: 'none',
            itemId: 'id0809',
          });
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
          //  console.log(res);
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

      {data?.transactionType == 'Buyer' && !isNullOrEmpty(data?.contacts[0].userID) && (
        <Text style={styles.header}>Buyer</Text>
      )}
      {data?.transactionType == 'Buyer' && (
        <TouchableOpacity onPress={() => handlePersonPressed(0)}>
          <View style={styles.buyerAndSellerRow}>
            <View style={styles.buyerAndSellerText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
                {data?.contacts[0].contactName}
              </Text>
            </View>
            {!isNullOrEmpty(data?.contacts[0].userID) && (
              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {data?.transactionType == 'Buyer' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={styles.header}>{'Buyer Lead Source'}</Text>
      )}
      {data?.transactionType == 'Buyer' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[0].leadSource}</Text>
      )}

      {data?.transactionType == 'Seller' && !isNullOrEmpty(data?.contacts[0].userID) && (
        <Text style={styles.header}>Seller</Text>
      )}
      {data?.transactionType == 'Seller' && (
        <TouchableOpacity onPress={() => handlePersonPressed(0)}>
          <View style={styles.buyerAndSellerRow}>
            <View style={styles.buyerAndSellerText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
                {data?.contacts[0].contactName}
              </Text>
            </View>
            {!isNullOrEmpty(data?.contacts[0].userID) && (
              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {data?.transactionType == 'Seller' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={styles.header}>{'Seller Lead Source'}</Text>
      )}
      {data?.transactionType == 'Seller' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[0].leadSource}</Text>
      )}

      {data?.transactionType == 'Buyer & Seller' &&
        !isNullOrEmpty(data?.contacts[0].userID) &&
        !isNullOrEmpty(data?.contacts[1].userID) && <Text style={styles.header}>Buyer</Text>}
      {data?.transactionType == 'Buyer & Seller' && (
        <TouchableOpacity onPress={() => handlePersonPressed(1)}>
          <View style={styles.buyerAndSellerRow}>
            <View style={styles.buyerAndSellerText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
                {data?.contacts[1].contactName}
              </Text>
            </View>
            {!isNullOrEmpty(data?.contacts[1].userID) && (
              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {data?.transactionType == 'Buyer & Seller' && !isNullOrEmpty(data?.contacts[1].leadSource) && (
        <Text style={styles.header}>{'Buyer Lead Source'}</Text>
      )}
      {data?.transactionType == 'Buyer & Seller' && !isNullOrEmpty(data?.contacts[1].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[1].leadSource}</Text>
      )}

      {data?.transactionType == 'Buyer & Seller' && !isNullOrEmpty(data?.contacts[0].userID) && (
        <Text style={styles.header}>Seller</Text>
      )}
      {data?.transactionType == 'Buyer & Seller' && (
        <TouchableOpacity onPress={() => handlePersonPressed(0)}>
          <View style={styles.buyerAndSellerRow}>
            <View style={styles.buyerAndSellerText}>
              <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
                {data?.contacts[0].contactName}
              </Text>
            </View>
            {!isNullOrEmpty(data?.contacts[0].userID) && (
              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {data?.transactionType == 'Buyer & Seller' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={styles.header}>{'Seller Lead Source'}</Text>
      )}
      {data?.transactionType == 'Buyer & Seller' && !isNullOrEmpty(data?.contacts[0].leadSource) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.contacts[0].leadSource}</Text>
      )}

      {data?.address.street != '' && <Text style={styles.header}>{'Street 1'}</Text>}
      {data?.address.street != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street}</Text>
      )}

      {data?.address.street2 != '' && <Text style={styles.header}>{'Street 2'}</Text>}
      {data?.address.street2 != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.street2}</Text>
      )}

      {data?.address.city != '' && <Text style={styles.header}>{'City'}</Text>}
      {data?.address.city != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.city}</Text>
      )}

      {data?.address.state != '' && <Text style={styles.header}>{'State / Province'}</Text>}
      {data?.address.state != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.state}</Text>
      )}

      {data?.address.zip != '' && <Text style={styles.header}>{'Zip / Postal Code'}</Text>}
      {data?.address.zip != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.address.zip}</Text>
      )}

      {!isNullOrEmpty(data?.probabilityToClose) && <Text style={styles.header}>{'Probability to Close'}</Text>}
      {!isNullOrEmpty(data?.probabilityToClose) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.probabilityToClose}</Text>
      )}

      {data?.transactionType != 'Buyer' && !isNullOrEmpty(data?.listAmount) && data?.listAmount != '0' && (
        <Text style={styles.header}>{'Original List Price'}</Text>
      )}
      {data?.transactionType != 'Buyer' && !isNullOrEmpty(data?.listAmount) && data?.listAmount != '0' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{'$' + data?.listAmount}</Text>
      )}

      {data?.transactionType != 'Buyer' && !isNullOrEmpty(data?.listDate) && (
        <Text style={styles.header}>{'Original List Date'}</Text>
      )}
      {data?.transactionType != 'Buyer' && !isNullOrEmpty(data?.listDate) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{prettyDate(data?.listDate!)}</Text>
      )}

      {!isNullOrEmpty(data?.projectedAmount) && <Text style={styles.header}>{'Projected Closing Price'}</Text>}
      {!isNullOrEmpty(data?.projectedAmount) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{'$' + data?.projectedAmount}</Text>
      )}

      {!isNullOrEmpty(data?.closingDate) && <Text style={styles.header}>{'Projected Closing Date'}</Text>}
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
          {formatDollarOrPercent(roundToInt(data?.additionalIncome!), data?.additionalIncomeType!)}
        </Text>
      )}

      {!isNullOrEmpty(data?.grossCommision) && (
        <View style={styles.boxRow}>
          <Text style={styles.header}>My Gross Commission</Text>
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
          {formatDollarOrPercent(data?.commissionPortion!, 'percent')}
        </Text>
      )}

      {!isNullOrEmpty(data?.miscAfterSplitFees) && <Text style={styles.header}>{'Misc After-Split Fees'}</Text>}
      {!isNullOrEmpty(data?.miscAfterSplitFees) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>
          {formatDollarOrPercent(data?.miscAfterSplitFees!, data?.miscAfterSplitFeesType!)}
        </Text>
      )}

      <View style={styles.boxRow}>
        <Text style={styles.header}>{'Income After Split and Fees'}</Text>
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
    fontSize: fontSize,
    color: 'gray',
  },
  textDark: {
    paddingTop: 5,
    marginLeft: 20,
    fontSize: fontSize,
    color: 'white',
  },
  textLight: {
    paddingTop: 5,
    marginLeft: 20,
    fontSize: fontSize,
    color: 'black',
  },
  boxTextDark: {
    paddingTop: 10,
    marginLeft: 20,
    fontSize: fontSize,
    color: 'white',
    paddingRight: 10,
  },
  boxTextLight: {
    paddingTop: 10,
    marginLeft: 20,
    fontSize: fontSize,
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
  buyerAndSellerRow: {
    flexDirection: 'row',
  },
  buyerAndSellerText: {
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
