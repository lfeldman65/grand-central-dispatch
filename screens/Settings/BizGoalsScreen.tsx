import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { getBizGoals, updateBizGoals } from './api';
import { removeTrailingDecimal, removeLeadingDecimal } from './settingsHelpers';

export default function BizGoalsScreen1(props: any) {
  const [netIncome, setNetIncome] = useState('');
  const [netIncomeBU, setNetIncomeBU] = useState(''); // BU = backup
  const [taxRatePercent, setTaxRatePercent] = useState('');
  const [taxRatePercentBU, setTaxRatePercentBU] = useState('');
  const [annualExpenses, setAnnualExpenses] = useState('');
  const [annualExpensesBU, setAnnualExpensesBU] = useState('');
  const [aveAmount, setAveAmount] = useState('');
  const [aveAmountBU, setAveAmountBU] = useState('');
  const [agentBrokerSplit, setAgentBrokerSplit] = useState('');
  const [agentBrokerSplitBU, setAgentBrokerSplitBU] = useState('');
  const [aveCommission, setAveCommission] = useState('');
  const [aveCommissionBU, setAveCommissionBU] = useState('');
  const [dollarOrPercent, setDollarOrPercent] = useState('');
  const [dollarOrPercentBU, setDollarOrPercentBU] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Set Your Goals',
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={reviewPressed}>
          <Text style={styles.saveText}>Review</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    netIncome,
    netIncomeBU,
    taxRatePercent,
    taxRatePercentBU,
    annualExpenses,
    annualExpensesBU,
    aveAmount,
    aveAmountBU,
    agentBrokerSplit,
    agentBrokerSplitBU,
    aveCommission,
    aveCommissionBU,
    dollarOrPercent,
    dollarOrPercentBU,
  ]);

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
      setNetIncome(removeTrailingDecimal(desSal));
      setNetIncomeBU(removeTrailingDecimal(desSal));
    }
    if (taxRate == null || taxRate == '') {
      setTaxRatePercent('');
      setTaxRatePercentBU('');
    } else {
      setTaxRatePercent(removeLeadingDecimal(taxRate));
      setTaxRatePercentBU(removeLeadingDecimal(taxRate));
    }
    if (yearlyExp == null || yearlyExp == '') {
      setAnnualExpenses('');
      setAnnualExpensesBU('');
    } else {
      setAnnualExpenses(removeTrailingDecimal(yearlyExp));
      setAnnualExpensesBU(removeTrailingDecimal(yearlyExp));
    }
    if (commPercentage == null || commPercentage == '') {
      setAgentBrokerSplit('');
      setAgentBrokerSplitBU('');
    } else {
      setAgentBrokerSplit(removeLeadingDecimal(commPercentage));
      setAgentBrokerSplitBU(removeLeadingDecimal(commPercentage));
    }
    if (aveSalePrice == null || aveSalePrice == '') {
      setAveAmount('');
      setAveAmountBU('');
    } else {
      setAveAmount(removeTrailingDecimal(aveSalePrice));
      setAveAmountBU(removeTrailingDecimal(aveSalePrice));
    }
    console.log('commtypelf: ' + commType!);
    setDollarOrPercent(commType!);
    setDollarOrPercentBU(commType!);
    if (aveComm == null || aveComm == '') {
      setAveCommission('');
      setAveCommissionBU('');
    } else {
      if (commType == 'dollar') {
        setAveCommission(removeTrailingDecimal(aveComm!));
        setAveCommissionBU(removeTrailingDecimal(aveComm!));
      } else {
        setAveCommission(removeLeadingDecimal(aveComm!));
        setAveCommissionBU(removeLeadingDecimal(aveComm!));
      }
      setAveCommission(removeTrailingDecimal(aveComm));
      setAveCommissionBU(removeTrailingDecimal(aveComm));
    }
  }

  function backPressed() {
    restoreFields();
  }

  function restoreFields() {
    console.log('lf commission BU: ' + aveCommissionBU);
    console.log('lf dollarOrPercent BU: ' + dollarOrPercentBU);

    var commission = aveCommissionBU;
    if (dollarOrPercentBU == 'percentage') {
      commission = '.' + aveCommissionBU;
    }
    console.log('lf commission: ' + commission);
    updateBizGoals(
      netIncomeBU,
      '.' + taxRatePercentBU,
      annualExpensesBU,
      '.' + agentBrokerSplitBU,
      aveAmountBU,
      commission,
      dollarOrPercentBU
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
        } else {
          navigation.goBack();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function goToReview() {
    navigation.navigate('BizGoalsReview');
  }

  function dollarPressed() {
    if (dollarOrPercent == 'percentage') {
      setDollarOrPercent('dollar');
    }
  }

  function percentPressed() {
    if (dollarOrPercent == 'dollar') {
      setDollarOrPercent('percentage');
    }
  }

  function reviewPressed() {
    if (!validateFields()) {
      Alert.alert('All fields are required');
      return;
    }
    var aveComm2 = aveCommission;
    if (dollarOrPercent == 'percentage') {
      aveComm2 = '.' + aveCommission;
    }
    updateBizGoals(
      netIncome,
      '.' + taxRatePercent,
      annualExpenses,
      '.' + agentBrokerSplit,
      aveAmount,
      aveComm2,
      dollarOrPercent
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
        } else {
          //   console.log(res);
          goToReview();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function validateFields() {
    if (
      netIncome == '' ||
      taxRatePercent == '' ||
      annualExpenses == '' ||
      agentBrokerSplit == '' ||
      aveAmount == '' ||
      aveCommission == ''
    ) {
      return false;
    }
    return true;
  }

  function fetchBizGoals(isMounted: boolean) {
    getBizGoals()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          if (!isMounted) {
            return;
          }
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
            onChangeText={(text) => setNetIncome(removeTrailingDecimal(text))}
            defaultValue={removeTrailingDecimal(netIncome)}
            keyboardType="number-pad"
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
            onChangeText={(text) => setTaxRatePercent(text)}
            defaultValue={taxRatePercent}
            keyboardType="number-pad"
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
            onChangeText={(text) => setAnnualExpenses(removeTrailingDecimal(text))}
            defaultValue={removeTrailingDecimal(annualExpenses)}
            keyboardType="number-pad"
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
            keyboardType="number-pad"
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
            keyboardType="number-pad"
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>What is the average commission you receive for each transactions?</Text>
      <View style={styles.mainContent}>
        <View style={styles.aveCommRow}>
          <View style={styles.dollarView}>
            <Text
              onPress={dollarPressed}
              style={dollarOrPercent == 'dollar' ? styles.dollarText : styles.dollarTextDim}
            >
              $
            </Text>
          </View>
          <View style={styles.aveCommInputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setAveCommission(text)}
              defaultValue={aveCommission}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.percentView}>
            <Text
              onPress={percentPressed}
              style={dollarOrPercent == 'percentage' ? styles.percentText : styles.percentTextDim}
            >
              %
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
    borderWidth: 0.5,
    borderTopColor: '#1A6295',
  },
  mainContent: {
    alignItems: 'center',
  },
  aveCommRow: {
    flexDirection: 'row',
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
    //  width: 300,
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
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  aveCommInputView: {
    backgroundColor: '#002341',
    width: '77%',
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  bottom: {
    height: 300, // leave room for keyboard
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  dollarView: {
    backgroundColor: '#002341',
    height: 50,
    width: '5%',
  },
  percentView: {
    backgroundColor: '#002341',
    height: 50,
    width: '8%',
    // paddingRight: 10,
  },
  dollarText: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    paddingLeft: 10,
    opacity: 1.0,
  },
  dollarTextDim: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    paddingLeft: 10,
    opacity: 0.4,
  },
  percentText: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    opacity: 1.0,
    paddingRight: 10,
  },
  percentTextDim: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    opacity: 0.4,
  },
});
