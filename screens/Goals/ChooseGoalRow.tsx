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

  function formatTitle(ugly: string) {
    if (ugly == 'Referrals Given') {
      return 'Referrals Tracked';
    }
    if (ugly == 'Notes Made') {
      return 'Notes Written';
    }
    return ugly;
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      {props.data.title != 'New Contacts' && props.data.title != 'Referrals Received' && (
        <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={props.lightOrDark == 'dark' ? styles.goalDark : styles.goalLight}>
            {formatTitle(props.data.title)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  goalDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  goalLight: {
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
