import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { VideoDetailsDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';
import { prettyDate } from '../../utils/general';

const chevron = require('../../images/chevron_blue_right.png');

interface VideoDetailsRowProps {
  data: VideoDetailsDataProps;
  onPress(): void;
  lightOrDark: string;
}

export default function VideoDetailRows(props: VideoDetailsRowProps) {
  const isFocused = useIsFocused();
  const newDate = props.data.dateViewed + 'Z';
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.textBox}>
          <Text style={props.lightOrDark == 'dark' ? styles.nameTextDark : styles.nameTextLight}>
            {props.data.fullName ?? 'Anonymous' + ' watched this video'}
          </Text>
          <Text style={styles.dateText}>
            <Text style={styles.dateText}>{prettyDate(props.data.dateViewed) + ' '}</Text>
            {new Date(newDate).toLocaleTimeString('en-us', {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {props.data.fullName != null && (
          <View style={styles.chevronBox}>
            <Image source={chevron} style={styles.chevron} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  rowLight: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },
  textBox: {
    flexDirection: 'column',
    height: 85,
    width: '88%',
    marginLeft: 5,
    textAlign: 'left',
  },
  nameTextDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 15,
  },
  nameTextLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 15,
  },
  dateText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 10,
  },
  chevronBox: {
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'center',
  },
  chevron: {
    height: 20,
    width: 12,
  },
});
