import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import styles from './styles';
import { analytics } from '../../utils/analytics';
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
