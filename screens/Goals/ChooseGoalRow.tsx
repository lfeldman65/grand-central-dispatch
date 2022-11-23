import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { GoalDataConciseProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';

interface GoalProps {
  data: GoalDataConciseProps;
  onPress(): void;
  lightOrDark: string;
}

export default function ChooseGoalRow(props: GoalProps) {
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {props.data.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  personNameDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  personNameLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
});
