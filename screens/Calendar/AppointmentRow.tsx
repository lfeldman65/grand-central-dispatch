import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AppointmentDataProps } from './interfaces';
import { prettyDate } from '../Relationships/relationshipHelpers';

interface ApptRowProps {
  data: AppointmentDataProps;
  onPress(): void;
  appID: string;
  lightOrDark: string;
}

let deviceWidth = Dimensions.get('window').width;
console.log('width: ' + deviceWidth);

export default function AppointmentRow(props: ApptRowProps) {
  function makeDateTimeRow() {
    var dateTimeRow = '';
    if (prettyDate(props.data.startTime) == prettyDate(props.data.endTime)) {
      dateTimeRow =
        prettyDate(props.data.startTime) +
        ': ' +
        new Date(props.data.startTime).toLocaleTimeString('en-us', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        }) +
        ' - ' +
        new Date(props.data.endTime).toLocaleTimeString('en-us', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        });
    } else {
      dateTimeRow =
        prettyDate(props.data.startTime) +
        ': ' +
        new Date(props.data.startTime).toLocaleTimeString('en-us', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        }) +
        ' - ' +
        prettyDate(props.data.endTime) +
        ': ' +
        new Date(props.data.endTime).toLocaleTimeString('en-us', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        });
    }
    return dateTimeRow;
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.titleRow}>
          <Text style={props.lightOrDark == 'dark' ? styles.appTitleDark : styles.appTitleLight}>
            {props.data.title}
          </Text>
        </View>

        <View style={styles.startView}>
          <Text style={props.lightOrDark == 'dark' ? styles.dateDark : styles.dateLight}>{makeDateTimeRow()}</Text>
        </View>
        {/* {props.data.notes != '' && (
          <Text style={styles.notesText}>{makeLongTxtPretty(props.data.notes, 0.1 * deviceWidth)}</Text>
        )} */}
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
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
  dateDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
  dateLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
});
