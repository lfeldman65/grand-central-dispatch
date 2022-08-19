import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

const rmLogo = require('../../images/logoWide.png');

const Sheets = {
  bizTypeSheet: 'filter_sheet_bizType',
  timeZoneSheet: 'filter_sheet_timeZone',
};

const bizTypeMenu = {
  Realtor: 'Realtor',
  Lender: 'Lender',
  Both: 'Both',
};

export default function ProfileScreen1(props: any) {
  const [email, setEmail] = useState('');
  const [bizType, setBizType] = useState('Both');
  const [timeZone, setTimeZone] = useState('Pacific Standard Time');
  const [mobilePhone, setMobilePhone] = useState('');
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Welcome',
      headerLeft: () => <Button color="#fff" onPress={backPressed} title="Back" />,
      headerRight: () => <Button color="#fff" onPress={nextPressed} title="Next" />,
    });
  }, [navigation, email, timeZone, mobilePhone, bizType]);

  function businessTypePressed() {
    console.log('business type pressed');
    SheetManager.show(Sheets.bizTypeSheet);
  }

  function timeZonePressed() {
    console.log('time zone pressed');
  }

  function backPressed() {
    navigation.navigate('SettingsScreen');
  }

  function nextPressed() {
    navigation.navigate('Profile2', {
      email: email,
      businessType: bizType,
      timeZone: timeZone,
      mobile: mobilePhone,
    });
  }

  return <ScrollView style={styles.container}></ScrollView>;
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
    height: 190,
    flexDirection: 'column',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  imageBox: {
    width: 200,
    height: 30,
    marginTop: 20,
    marginRight: 30,
    alignSelf: 'center',
  },
  logoImage: {
    height: 30,
    width: 200,
    marginLeft: 15,
    marginRight: 5,
    alignItems: 'center',
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
    marginBottom: 5,
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
});
