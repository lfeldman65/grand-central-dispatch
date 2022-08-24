import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { getProfileData } from './api';
import { bizTypeMenu } from './settingsHelpers';
import momentTZ from 'moment-timezone';

const rmLogo = require('../../images/logoWide.png');

const Sheets = {
  bizTypeSheet: 'filter_sheet_bizType',
  timeZoneSheet: 'filter_sheet_timeZone',
};

export default function ProfileScreen1(props: any) {
  const [email, setEmail] = useState('');
  const [bizType, setBizType] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();
  const timeZonesList = momentTZ.tz.names();

  useEffect(() => {
    navigation.setOptions({
      title: 'Welcome',
      headerLeft: () => <Button color="#fff" onPress={backPressed} title="Back" />,
      headerRight: () => <Button color="#fff" onPress={nextPressed} title="Next" />,
    });
  }, [navigation, email, timeZone, mobilePhone, bizType]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  function convertToParam(pretty: string) {
    if (pretty == 'Both') {
      return 'realtorAndLender';
    }
    return pretty;
  }

  function initializeFields(email?: string, bizType?: string, timeZone?: string, mobile?: string) {
    console.log(timeZonesList);

    if (email == null || email == '') {
      setEmail('');
    } else {
      setEmail(email);
    }
    if (bizType == null || bizType == '' || bizType == 'realtorAndLender') {
      setBizType('Both');
    } else {
      setBizType(bizType);
    }
    if (bizType == 'realtor') {
      setBizType('Realtor');
    }
    if (bizType == 'lender') {
      setBizType('Lender');
    }
    if (timeZone == null || timeZone == '') {
      setTimeZone('');
    } else {
      setTimeZone(timeZone);
    }
    if (mobile == null || mobile == '') {
      setMobilePhone('');
    } else {
      setMobilePhone(mobile);
    }
  }

  function businessTypePressed() {
    console.log('business type pressed');
    SheetManager.show(Sheets.bizTypeSheet);
  }

  function timeZonePressed() {
    console.log('time zone pressed');
    SheetManager.show(Sheets.timeZoneSheet);
  }

  function backPressed() {
    navigation.navigate('SettingsScreen');
  }

  function nextPressed() {
    console.log('biz type:' + convertToParam(bizType));
    navigation.navigate('Profile2', {
      email: email,
      businessType: convertToParam(bizType),
      timeZone: timeZone,
      mobile: mobilePhone,
    });
  }

  function fetchProfile(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    getProfileData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          //  setProfileData(res.data);
          console.log(res.data);
          initializeFields(res.data.email, res.data.businessType, res.data.timezone, res.data.mobile);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.imageBox}>
          <Image source={rmLogo} style={styles.logoImage} />
        </View>
        <Text style={styles.fieldText}>
          Spend a few minutes with our setup wizard to maximize the lead genereration potential of your relationships.
          Don't worry, we've made the process easy, and you can always come back and update or add info you might not
          have today.
        </Text>
      </View>
      <Text></Text>
      <Text style={styles.nameTitle}>Email</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setEmail(text)}
            defaultValue={email}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Business Type</Text>
      <TouchableOpacity onPress={businessTypePressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{bizType}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet // Biz Type
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('bizType')}
        id={Sheets.bizTypeSheet}
        ref={actionSheetRef}
        statusBarTranslucent
        bounceOnOpen={true}
        drawUnderStatusBar={true}
        bounciness={4}
        gestureEnabled={true}
        bottomOffset={40}
        defaultOverlayOpacity={0.3}
      >
        <View
          style={{
            paddingHorizontal: 12,
          }}
        >
          <ScrollView
            nestedScrollEnabled
            onMomentumScrollEnd={() => {
              actionSheetRef.current?.handleChildScrollEnd();
            }}
            style={styles.filterView}
          >
            <View>
              {Object.entries(bizTypeMenu).map(([key, value]) => (
                <TouchableOpacity
                  //  key={key}
                  onPress={() => {
                    SheetManager.hide(Sheets.bizTypeSheet, null);
                    console.log('biz type: ' + value);
                    setBizType(value);
                  }}
                  style={styles.listItemCell}
                >
                  <Text style={styles.listItem}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ActionSheet>

      <Text style={styles.nameTitle}>Time Zone</Text>
      <TouchableOpacity onPress={timeZonePressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{timeZone}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet // Time Zone
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('timeZone')}
        id={Sheets.timeZoneSheet}
        ref={actionSheetRef}
        statusBarTranslucent
        bounceOnOpen={true}
        drawUnderStatusBar={true}
        bounciness={4}
        gestureEnabled={true}
        bottomOffset={40}
        defaultOverlayOpacity={0.3}
      >
        <View
          style={{
            paddingHorizontal: 12,
          }}
        >
          <ScrollView
            nestedScrollEnabled
            onMomentumScrollEnd={() => {
              actionSheetRef.current?.handleChildScrollEnd();
            }}
            style={styles.filterView}
          >
            <View>
              {Object.entries(timeZone).map(([key, value]) => (
                <TouchableOpacity
                  //  key={key}
                  onPress={() => {
                    SheetManager.hide(Sheets.timeZoneSheet, null);
                    console.log('time zone: ' + value);
                    setTimeZone(value);
                  }}
                  style={styles.listItemCell}
                >
                  <Text style={styles.listItem}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ActionSheet>

      <Text style={styles.nameTitle}>Mobile Number</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setMobilePhone(text)}
            defaultValue={mobilePhone}
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
