import { Text, View, Image, TouchableOpacity, StyleSheet, Alert, Linking, AppState } from 'react-native';
import { AppointmentDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { prettyDate, makeLongTxtPretty } from '../../utils/general';

interface ApptRowProps {
  data: AppointmentDataProps;
  onPress(): void;
  appID: string;
  lightOrDark: string;
}

export default function AppointmentRow(props: ApptRowProps) {
  const isFocused = useIsFocused();

  useEffect(() => {
    // console.log('appt start: ' + props.data.startTime);
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.titleRow}>
          <Text style={props.lightOrDark == 'dark' ? styles.appTitleDark : styles.appTitleLight}>
            {props.data.title}
          </Text>
        </View>

        <View style={styles.startView}>
          <Text style={props.lightOrDark == 'dark' ? styles.dateDark : styles.dateLight}>
            {'Start: ' + prettyDate(props.data.startTime)}
          </Text>
          <Text style={props.lightOrDark == 'dark' ? styles.dateDark : styles.dateLight}>
            {new Date(props.data.startTime).toLocaleTimeString('en-us', {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.startView}>
          <Text style={props.lightOrDark == 'dark' ? styles.dateDark : styles.dateLight}>
            {'End: ' + prettyDate(props.data.endTime)}
          </Text>
          <Text style={props.lightOrDark == 'dark' ? styles.dateDark : styles.dateLight}>
            {new Date(props.data.endTime).toLocaleTimeString('en-us', {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {props.data.notes != '' && <Text style={styles.notesText}>{makeLongTxtPretty(props.data.notes, 40)}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  rowLight: {
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
  },
  appTitleDark: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  appTitleLight: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  startView: {
    flexDirection: 'row',
  },
  notesText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
  },
  dateDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
  dateLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
});
