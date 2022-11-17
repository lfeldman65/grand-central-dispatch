import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from './styles';
import { TransactionDataProps, TxChangeStatusProps } from './interfaces';
import { useEffect } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { prettyDate } from '../../utils/general';

interface TransactionRowProps {
  data: TransactionDataProps;
  onPress(): void;
  refresh(): void;
  onChangeStatus(): void;
  lightOrDark: string;
}

export default function TransactionRow(props: TransactionRowProps) {
  useEffect;
  async function changeStatus(dealId: number, newStatus: string) {
    console.log('change status pressed');
    props.onChangeStatus();
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
        <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <View style={styles.transactionRow}>
            <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {props.data.contactName}
            </Text>
            <Text style={props.lightOrDark == 'dark' ? styles.transactionDateDark : styles.transactionDateLight}>
              {prettyDate(props.data.closingDate)}
            </Text>
          </View>
          <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {props.data.title}
          </Text>
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
