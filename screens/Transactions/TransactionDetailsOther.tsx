import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import globalStyles from '../../globalStyles';
import { TransactionDetailsProps } from './interfaces';
import { getTransactionDetails, deleteTx } from './api';
import { isNullOrEmpty } from '../../utils/general';
import { prettyDate } from '../../utils/general';
import { ga4Analytics } from '../../utils/general';

const chevron = require('../../images/chevron_blue_right.png');
const fontSize = 16;

export default function TransactionDetailsOther(props: any) {
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
    ga4Analytics('Other_Transactions_Edit', {
      contentType: 'none',
      itemId: 'id1008',
    });
    navigation.navigate('AddOrEditOtherTx1', {
      data: data,
    });
  }

  useEffect(() => {
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
          ga4Analytics('Other_Transactions_Delete', {
            contentType: 'none',
            itemId: 'id1009',
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
          console.log(res);

          console.log('contacts' + JSON.stringify(res.data.contacts));
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <Text style={styles.header}>{'Transaction Type'}</Text>
      <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.transactionType}</Text>

      {data?.title != '' && <Text style={styles.header}>{'Transaction Title'}</Text>}
      {data?.title != '' && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.title}</Text>
      )}

      <Text style={styles.header}>{'Status'}</Text>
      <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{data?.status}</Text>

      {!isNullOrEmpty(data?.contacts) && !isNullOrEmpty(data?.contacts[0].userID) && (
        <Text style={styles.header}>{"Who's Involved"}</Text>
      )}
      {data?.contacts.map((item, index) => (
        <TouchableOpacity onPress={() => handlePersonPressed(index)}>
          <View style={styles.textAndChevronRow}>
            <View style={styles.whoInvolvedText}>
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

      {data?.address.street != '' && data?.address.street != '' && <Text style={styles.header}>{'Street 1'}</Text>}
      {data?.address.street != '' && data?.address.street != '' && (
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

      {!isNullOrEmpty(data?.projectedAmount) && <Text style={styles.header}>{'Projected Closing Price'}</Text>}
      {!isNullOrEmpty(data?.projectedAmount) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{'$' + data?.projectedAmount}</Text>
      )}

      {!isNullOrEmpty(data?.closingDate) && <Text style={styles.header}>{'Projected Closing Date'}</Text>}
      {!isNullOrEmpty(data?.closingDate) && (
        <Text style={lightOrDark == 'dark' ? styles.textDark : styles.textLight}>{prettyDate(data?.closingDate!)}</Text>
      )}

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
  referralAndSpouseRow: {
    flexDirection: 'row',
  },
  whoInvolvedText: {
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
  textAndChevronRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
