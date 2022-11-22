import { Text, View, Image, TouchableOpacity, StyleSheet, Alert, Linking, AppState } from 'react-native';
import { AppointmentDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { getAppointments } from './api';
import { prettyDate, prettyTime } from '../../utils/general';

interface ApptRowProps {
  data: AppointmentDataProps;
  onPress(): void;
  appID: string;
}

export default function AppointmentRow(props: ApptRowProps) {
  const { appID } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isFavorite, setIsFavorite] = useState('False');

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
        <Text style={lightOrDark == 'dark' ? styles.timeDark : styles.timeLight}>
          {prettyDate(props.data.startTime)}
        </Text>

        <View style={styles.titleAndTimeRow}>
          <Text style={lightOrDark == 'dark' ? styles.appTitleDark : styles.appTitleLight}>{props.data.title}</Text>
          <Text>{new Date(props.data.startTime).toLocaleTimeString()}</Text>
        </View>

        {props.data.notes != '' && (
          <Text style={lightOrDark == 'dark' ? styles.notesDark : styles.notesLight}>{props.data.notes}</Text>
        )}

        {/* <Text>{appID}</Text>
        <Text>{new Date(props.data.startTime).toLocaleTimeString()}</Text>
        <Text>{props.data.startTime}</Text> */}
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
  titleAndTimeRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
    marginRight: 20,
  },
  textBoxDark: {
    flexDirection: 'column',
    height: 80,
    backgroundColor: 'black',
    width: '55%',
    marginLeft: 5,
    textAlign: 'left',
  },
  textBoxLight: {
    flexDirection: 'column',
    height: 80,
    backgroundColor: 'white',
    width: '55%',
    marginLeft: 5,
    textAlign: 'left',
  },
  appTitleDark: {
    color: 'white',
    fontSize: 22,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
  appTitleLight: {
    color: 'black',
    fontSize: 22,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
  notesDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  notesLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  timeDark: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    fontWeight: '500',
  },
  timeLight: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    fontWeight: '500',
  },
  chevronBox: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 15,
    width: '30%',
  },
  chevron: {
    height: 20,
    width: 12,
    marginTop: 15,
  },
});
