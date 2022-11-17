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
import { removeTrailingDecimal, roundToInt } from './settingsHelpers';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

export default function BizGoalsReviewScreen(props: any) {
  const { route } = props;
  const isFocused = useIsFocused();
  const [lightOrDark, setLightOrDark] = useState('');
  const [summaryData, setSummaryData] = useState<BizGoalsSummaryDataProps>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Goals Review',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    fetchGoalSummary(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function savePressed() {
    navigation.navigate('SettingsScreen');
  }

  function fetchGoalSummary(isMounted: boolean) {
    getBizGoalsSummary()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          setSummaryData(res.data);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <ScrollView style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Yearly Income Goals</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Net Income</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {'$' + removeTrailingDecimal(summaryData?.yearlyNetIncome!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Gross Income</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {'$' + removeTrailingDecimal(summaryData?.yearlyGrossIncome!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Transactions</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.yearlyTransactions!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Referrals</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.yearlyReferrals!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Voice-to-Voice or Face-to-Face Contacts</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.yearlyContacts!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Monthly Income Goals</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Net Income</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {'$' + removeTrailingDecimal(summaryData?.monthlyNetIncome!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Gross Income</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {'$' + removeTrailingDecimal(summaryData?.monthlyGrossIncome!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Transactions</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.monthlyTransactions!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Referrals</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.monthlyReferrals!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Voice-to-Voice or Face-to-Face Contacts</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>
          {roundToInt(summaryData?.monthlyContacts!)}
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>
          Recommended Weekly Activities
        </Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Calls</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.weeklyCalls}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Notes</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.weeklyNotes}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Pop-Bys</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.weeklyPopBys}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Recommended Daily Activities</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Calls</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.dailyCalls}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Notes</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.dailyNotes}</Text>
        <View style={styles.dividingLine}></View>
        <Text style={styles.nameTitle}>Pop-Bys</Text>
        <Text style={lightOrDark == 'dark' ? styles.dataDark : styles.dataLight}>{summaryData?.dailyPopBys}</Text>
        <View style={styles.dividingLine}></View>
      </ScrollView>
    </>
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
