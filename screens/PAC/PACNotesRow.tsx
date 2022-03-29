import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { PACDataProps } from './interfaces';

interface PACNotesRowProps {
  data: PACDataProps;
  onPress(): void;
}

export default function PACNotesRow(props: PACNotesRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Text style={styles.personName}>{props.data.contactName}</Text>
        <Text style={styles.otherText}>{'Ranking: ' + props.data.ranking}</Text>

        <Text style={styles.otherText}>{'Last Note Sent: ' + props.data.lastNoteDate}</Text>

        {props.data.street1 != null && <Text style={styles.streetText}>{props.data.street1}</Text>}
        {props.data.street2 != null && <Text style={styles.streetText}>{props.data.street2}</Text>}
        {props.data.city != null && (
          <Text style={styles.cityStateZipText}>{props.data.city + ' ' + props.data.state + ' ' + props.data.zip}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
