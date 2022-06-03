import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from './styles';
import { TransactionDataProps, TxChangeStatusProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { prettyDate } from '../../utils/general';

import { changeTxStatus } from './api';

interface TransactionRowProps {
  data: TransactionDataProps;
  onPress(): void;
  refresh(): void;
  onChangeStatus(): void;
}

export default function TransactionRow(props: TransactionRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  async function changeStatus(dealId: number, newStatus: string) {
    console.log('change status pressed');

    props.onChangeStatus();

    //console.log('change status 2');
    //setIsLoading(true);
    //continueTxChangeStatus(dealId, newStatus, changeStatusSuccess, changeStatusFailure);
  }

  // function continueTxChangeStatus(dealId: number, type: string, onSuccess: any, onFailure: any) {
  //   changeTxStatus(dealId, type)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status == 'error') {
  //         console.error(res.error);
  //         onFailure();
  //       } else {
  //         onSuccess();
  //       }
  //     })
  //     .catch((error) => {
  //       onFailure();
  //       console.log('complete error' + error);
  //     });
  // }

  function changeStatusSuccess() {
    console.log('changeStatusSuccess');
    setIsLoading(false);
    props.refresh();
  }

  function changeStatusFailure() {
    setIsLoading(false);
    console.log('changeStatusFailure');
    props.refresh();
  }

  const renderRightActions = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <TouchableOpacity
          style={styles2.changeStatusButtonTouch}
          onPress={() => {
            changeStatus(props.data.id, props.data.contactName);
          }}
        >
          <Text style={styles2.changeStatusButton}>Change Status</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={70}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <TouchableOpacity onPress={props.onPress}>
        <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <View style={styles.transactionRow}>
            <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {props.data.contactName}
            </Text>
            <Text style={lightOrDark == 'dark' ? styles.transactionDateDark : styles.transactionDateLight}>
              {prettyDate(props.data.closingDate)}
            </Text>
          </View>
          <Text style={lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>{props.data.title}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export const styles2 = StyleSheet.create({
  changeStatusButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: 'white',
    fontSize: 18,
  },
  changeStatusButtonTouch: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: 'white',
    fontSize: 18,
  },
});
