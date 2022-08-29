import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { getBizGoals, updateBizGoals } from './api';

export default function BizGoalsScreen1(props: any) {
  const [netIncome, setNetIncome] = useState('');
  const [netIncomeBU, setNetIncomeBU] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [annualExpenses, setAnnualExpenses] = useState('');
  const [aveAmount, setAveAmount] = useState('');
  const [agentBrokerSplit, setAgentBrokerSplit] = useState('');
  const [aveCommission, setAveCommission] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Set Your Goals',
      headerLeft: () => <Button color="#fff" onPress={backPressed} title="Back" />,
      headerRight: () => <Button color="#fff" onPress={reviewPressed} title="Review" />,
    });
  }, [navigation, netIncome, taxRate, annualExpenses, aveAmount, agentBrokerSplit, aveCommission]);

  useEffect(() => {
    let isMounted = true;
    fetchBizGoals(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function initializeFields(
    desSal?: string,
    taxRate?: string,
    yearlyExp?: string,
    commPercentage?: string,
    aveSalePrice?: string,
    aveComm?: string,
    commType?: string
  ) {
    if (desSal == null || desSal == '') {
      setNetIncome('');
      setNetIncomeBU('');
    } else {
      setNetIncome(desSal);
      setNetIncomeBU(desSal);
    }
    if (taxRate == null || taxRate == '') {
      setTaxRate('');
    } else {
      setTaxRate(taxRate);
    }
    if (yearlyExp == null || yearlyExp == '') {
      setAnnualExpenses('');
    } else {
      setAnnualExpenses(yearlyExp);
    }
    if (commPercentage == null || commPercentage == '') {
      setAgentBrokerSplit('');
    } else {
      setAgentBrokerSplit(commPercentage);
    }
    if (aveSalePrice == null || aveSalePrice == '') {
      setAveAmount('');
    } else {
      setAveAmount(aveSalePrice);
    }
    if (aveComm == null || aveComm == '') {
      setAveCommission('');
    } else {
      setAveCommission(aveComm);
    }
  }

  function backPressed() {
    navigation.goBack();
  }

  function goToReview() {
    navigation.navigate('BizGoalsReview');
    // navigation.navigate('BizGoalsReview', {
    //   netIncome: netIncome, // desiredSalary
    //   taxRate: taxRate, // taxRate
    //   annualExpenses: annualExpenses, // yearlyExpenses
    //   agentBrokerSplit: agentBrokerSplit,
    //   aveAmount: aveAmount, // averageSalePrice
    //   aveCommission: aveCommission, // averageSaleCommission
    //   commissionType: 'dollar',
    // });
  }

  function reviewPressed() {
    updateBizGoals(netIncome, taxRate, annualExpenses, agentBrokerSplit, aveCommission, aveAmount, 'dollar')
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
        } else {
          console.log(res);
          goToReview();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchBizGoals(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    getBizGoals()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          initializeFields(
            res.data.desiredSalary,
            res.data.taxRate,
            res.data.yearlyExpenses,
            res.data.myCommissionPercentage,
            res.data.averageSalePrice,
            res.data.averageSaleCommission,
            res.data.commissionType
          );
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topView}></View>
      <Text style={styles.nameTitle}>
        How much money would you like to take home in the next 12 months? This is your net income.
      </Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setNetIncome(text)}
            defaultValue={netIncome}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>What is your tax rate? An estimate is OK.</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setTaxRate(text)}
            defaultValue={taxRate}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>
        Approximately how much are your annual business expenses? A ballpark figure is fine. It doesn't have to be
        exact.
      </Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setAnnualExpenses(text)}
            defaultValue={annualExpenses}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>
        What is your agent/broker split? What percent of your commission do you keep vs. what goes to the brokerage?
      </Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setAgentBrokerSplit(text)}
            defaultValue={agentBrokerSplit}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>
        What is the average sales price/loan amount of the transactions you closed in the last 12 months?
      </Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setAveAmount(text)}
            defaultValue={aveAmount}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>What is the average commission you receive for each transactions?</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setAveCommission(text)}
            defaultValue={aveCommission}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  mainContent: {
    alignItems: 'center',
  },
  topView: {
    height: 20,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  fieldText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 20,
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
});
