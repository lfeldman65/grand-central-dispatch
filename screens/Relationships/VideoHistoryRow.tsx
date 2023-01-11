import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { VideoSummaryDataProps } from './interfaces';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';

const chevron = require('../../images/chevron_blue_right.png');

interface VideoHistoryRowProps {
  data: VideoSummaryDataProps;
  onPress(): void;
  lightOrDark: string;
}

function makeTextPretty(name: string, count: number) {
  if (count == 1) {
    return '"' + name + '" has been watched 1 time';
  }
  return '"' + name + '" has been watched 1 times';
}

export default function VideoHistoryRow(props: VideoHistoryRowProps) {
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.textBox}>
          <Text style={props.lightOrDark == 'dark' ? styles.activityTextDark : styles.activityTextLight}>
            {makeTextPretty(props.data.videoTitle, props.data.viewCount)}
          </Text>
        </View>

        <View style={styles.chevronBox}>
          <Image source={chevron} style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 60,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 60,
  },
  textBox: {
    flexDirection: 'column',
    height: 75,
    width: '88%',
    marginLeft: 5,
    textAlign: 'left',
  },
  activityTextDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 14,
  },
  activityTextLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 14,
  },
  chevronBox: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  chevron: {
    height: 20,
    width: 12,
  },
});
