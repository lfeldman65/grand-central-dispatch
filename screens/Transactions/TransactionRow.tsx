import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { TransactionDataProps } from './interfaces';

interface TransactionRowProps {
  data: TransactionDataProps;
  onPress(): void;
}

export default function TransactionRow(props: TransactionRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.personName}>{props.data.contactName}</Text>
        <Text style={styles.otherText}>{'ID: ' + props.data.id}</Text>

        <Text style={styles.otherText}>{'Closing Date: ' + props.data.closingDate}</Text>

        {/* {props.data.street1 != null && <Text style={styles.streetText}>{props.data.street1}</Text>}
        {props.data.street2 != null && <Text style={styles.streetText}>{props.data.street2}</Text>}
        {props.data.city != null && (
          <Text style={styles.cityStateZipText}>{props.data.city + ' ' + props.data.state + ' ' + props.data.zip}</Text>
        )} */}
      </View>
    </TouchableOpacity>
  );
}
