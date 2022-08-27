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

export default function BizGoalsReviewScreen(props: any) {
  const { route } = props;
  const { netIncome, taxRate, annualExpenses, aveAmount, agentBrokerSplit, aveComm } = route.params;
  const isFocused = useIsFocused();
  const [summaryData, setSummaryData] = useState<BizGoalsSummaryDataProps>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Goals Review',
      headerRight: () => <Button color="#fff" onPress={savePressed} title="Save" />,
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
    // editProfileData(
    //   email,
    //   businessType,
    //   timeZone,
    //   mobile,
    //   firstName,
    //   lastName,
    //   company,
    //   'stree1',
    //   'street2',
    //   'city',
    //   'state',
    //   'zip',
    //   'country'
    // )
    //   .then((res) => {
    //     if (res.status == 'error') {
    //       console.log(res);
    //     } else {
    //       console.log(res);
    //       navigation.navigate('SettingsScreen');
    //     }
    //   })
    //   .catch((error) => console.error('failure ' + error));
  }

  function fetchGoalSummary(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    getBizGoalsSummary()
      .then((res) => {
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
    <ScrollView style={styles.container}>
      <Text style={styles.headerLight}>Yearly Income Goals</Text>
      <View style={styles.dividingLine}></View>
      <Text style={styles.nameTitle}>Net Income</Text>
      <Text style={styles.nameTitle}>{summaryData?.yearlyNetIncome}</Text>
      <Text style={styles.headerLight}>Monthly Income Goals</Text>
      <View style={styles.dividingLine}></View>
      <Text style={styles.headerLight}>Recommended Weekly Activities</Text>
      <View style={styles.dividingLine}></View>
      <Text style={styles.headerLight}>Recommended Daily Activities</Text>
      <View style={styles.dividingLine}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
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
  fieldText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  nameTitle: {
    color: 'gray',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  filterView: {
    width: '100%',
    padding: 12,
  },
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  dividingLine: {
    backgroundColor: 'lightgray',
    height: 1,
  },
  headerDark: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
  },
});
