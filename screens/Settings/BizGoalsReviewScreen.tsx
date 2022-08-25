import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import { getProfileData, editProfileData } from './api';
import { ProfileDataProps } from './interfaces';

export default function BizGoalsReviewScreen(props: any) {
  const { route } = props;
  const { email, businessType, timeZone, mobile } = route.params;
  const isFocused = useIsFocused();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Goals Review',
      headerRight: () => <Button color="#fff" onPress={donePressed} title="Done" />,
    });
  }, [navigation, firstName, lastName, company, street1, street2, city, state, zip, country]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function donePressed() {
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

  function initializeFields(firstName?: string, lastName?: string, companyName?: string) {
    if (firstName == null || firstName == '') {
      setFirstName('');
    } else {
      setFirstName(firstName);
    }
    if (lastName == null || lastName == '') {
      setLastName('');
    } else {
      setLastName(lastName);
    }
    if (companyName == null || companyName == '') {
      setCompany('');
    } else {
      setCompany(companyName);
    }
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
          console.log(res.data);
          initializeFields(res.data.firstName, res.data.lastName, res.data.companyName);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topView}></View>
      <Text></Text>
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
