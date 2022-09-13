import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import { getBizGoalsSummary } from './api';
import { BizGoalsSummaryDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { removeTrailingDecimal, roundToInt } from './settingsHelpers';

export default function BizGoalsReviewScreen(props: any) {
  const { route } = props;
  const isFocused = useIsFocused();
  const [summaryData, setSummaryData] = useState<BizGoalsSummaryDataProps>();
  const [lightOrDark, setIsLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Goals Review',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Review</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function savePressed() {
    navigation.navigate('SettingsScreen');
  }

  return (
    <ScrollView style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}></ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 1,
    marginTop: 10,
  },
  dataDark: {
    marginTop: 5,
    marginBottom: 10,
    color: 'white',
    fontSize: 16,
    marginLeft: 20,
  },
  dataLight: {
    marginTop: 5,
    marginBottom: 10,
    color: 'black',
    fontSize: 16,
    marginLeft: 20,
  },
  nameTitle: {
    color: 'gray',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 16,
  },
  dividingLine: {
    backgroundColor: 'lightgray',
    height: 1,
  },
  headerDark: {
    fontSize: 18,
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
