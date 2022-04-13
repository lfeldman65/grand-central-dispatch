import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { PACDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

interface PACNotesRowProps {
  data: PACDataProps;
  onPress(): void;
}

export default function PACNotesRow(props: PACNotesRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {props.data.contactName}
        </Text>
        <Text style={lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
          {'Ranking: ' + props.data.ranking}
        </Text>

        <Text style={lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
          {'Last Note Sent: ' + props.data.lastNoteDate}
        </Text>

        {props.data.street1 != null && (
          <Text style={lightOrDark == 'dark' ? styles.streetTextDark : styles.streetTextLight}>
            {props.data.street1}
          </Text>
        )}
        {props.data.street2 != null && (
          <Text style={lightOrDark == 'dark' ? styles.streetTextDark : styles.streetTextLight}>
            {props.data.street2}
          </Text>
        )}
        {props.data.city != null && (
          <Text style={lightOrDark == 'dark' ? styles.cityStateZipTextDark : styles.cityStateZipTextLight}>
            {props.data.city + ' ' + props.data.state + ' ' + props.data.zip}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
