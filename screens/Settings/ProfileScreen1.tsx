import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { getProfileData } from './api';
import { bizTypeMenu, timeZoneMenu } from './settingsHelpers';
import { storage } from '../../utils/storage';
import { useActionSheet } from '@expo/react-native-action-sheet';
const rmLogo = require('../../images/logoWide.png');

export default function ProfileScreen1(props: any) {
  const [email, setEmail] = useState('');
  const [bizType, setBizType] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    navigation.setOptions({
      title: 'Welcome',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={nextPressed}>
          <Text style={styles.saveText}>Next</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, email, timeZone, mobilePhone, bizType]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const timeZonePressed = () => {
    const options = timeZoneMenu;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          setTimeZone(options[selectedIndex!]);
        }
      }
    );
  };

  const businessTypePressed = () => {
    const options = bizTypeMenu;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          setBizType(options[selectedIndex!]);
        }
      }
    );
  };

  function convertToParam(pretty: string) {
    if (pretty == 'Both Agent and Lender') {
      return 'realtorAndLender';
    }
    if (pretty == 'Agent') {
      return 'realtor';
    }
    if (pretty == 'Lender') {
      return 'lender';
    }
    return pretty;
  }

  function initializeFields(email?: string, bizType?: string, timeZone?: string, mobile?: string) {
    //  console.log(timeZonesList);
    if (email == null || email == '') {
      setEmail('');
    } else {
      setEmail(email);
    }
    if (bizType == null || bizType == '' || bizType == 'realtorAndLender') {
      setBizType('Both Agent and Lender');
    } else {
      setBizType(bizType);
    }
    if (bizType == 'realtor') {
      setBizType('Agent');
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

  function backPressed() {
    navigation.navigate('SettingsScreen');
  }

  function nextPressed() {
    // console.log('biz type:' + convertToParam(bizType));
    storage.setItem('businessType', convertToParam(bizType));
    navigation.navigate('Profile2', {
      email: email,
      businessType: convertToParam(bizType),
      timeZone: timeZone,
      mobile: mobilePhone,
    });
  }

  function fetchProfile(isMounted: boolean) {
    getProfileData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
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

      <Text style={styles.nameTitle}>Time Zone</Text>
      <TouchableOpacity onPress={timeZonePressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{timeZone}</Text>
          </View>
        </View>
      </TouchableOpacity>

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
      <View style={styles.bottom}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  mainContent: {
    alignItems: 'center',
  },
  topView: {
    flexDirection: 'column',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
    paddingLeft: 5,
    paddingRight: 8,
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
  bottom: {
    height: 300, // leave room for keyboard
  },
});
