import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import React from 'react';
import { getProfileData, editProfileData } from './api';

export default function ProfileScreen2(props: any) {
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
      title: 'Mailing Address',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, firstName, lastName, company, street1, street2, city, state, zip, country]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function savePressed() {
    editProfileData(
      email,
      businessType,
      timeZone,
      mobile,
      firstName,
      lastName,
      company,
      street1,
      street2,
      city,
      state,
      zip,
      country
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
        } else {
          console.log(res);
          navigation.navigate('SettingsScreen');
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function initializeFields(
    firstName?: string,
    lastName?: string,
    companyName?: string,
    street1?: string,
    street2?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string
  ) {
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
    if (street1 == null || street1 == '') {
      setStreet1('');
    } else {
      setStreet1(street1);
    }
    if (street2 == null || street2 == '') {
      setStreet2('');
    } else {
      setStreet2(street2);
    }
    if (city == null || city == '') {
      setCity('');
    } else {
      setCity(city);
    }
    if (state == null || state == '') {
      setState('');
    } else {
      setState(state);
    }
    if (zip == null || zip == '') {
      setZip('');
    } else {
      setZip(zip);
    }
    if (country == null || country == '') {
      setCountry('');
    } else {
      setCountry(country);
    }
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
          initializeFields(
            res.data.firstName,
            res.data.lastName,
            res.data.companyName,
            res.data.street1,
            res.data.street2,
            res.data.city,
            res.data.state,
            res.data.zip,
            res.data.country
          );
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.fieldText}>
          {
            'Enter your mailing address to utilize our Client Appreciation Program (CAP), a consistent target marketing that deepens trust with your relationships. Set the foundation of your campaigns in our mobile app and take full advantage of the feature in our Web portal.'
          }
        </Text>
      </View>
      <Text></Text>
      <Text style={styles.nameTitle}>First Name</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setFirstName(text)}
            defaultValue={firstName}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Last Name</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setLastName(text)}
            defaultValue={lastName}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Company Name</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setCompany(text)}
            defaultValue={company}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Street 1</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet1(text)}
            defaultValue={street1}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Street 2</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet2(text)}
            defaultValue={street2}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>City</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setCity(text)}
            defaultValue={city}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>State / Province</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setState(text)}
            defaultValue={state}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Zip / Postal Code</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setZip(text)}
            defaultValue={zip}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Country</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setCountry(text)}
            defaultValue={country}
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
    height: 150,
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
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
