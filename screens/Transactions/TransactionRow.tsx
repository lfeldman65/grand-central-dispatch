import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { TransactionDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';

interface TransactionRowProps {
  data: TransactionDataProps;
  onPress(): void;
}

export default function TransactionRow(props: TransactionRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  function prettyDate(uglyDate: string) {
    var dateOnly = uglyDate.substring(0, 10);
    var dateParts = dateOnly.split('-');
    console.log(dateParts[0]);
    var year = dateParts[0];
    return dateParts[1] + '/' + dateParts[2] + '/' + year;
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  return (
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
  );
}
