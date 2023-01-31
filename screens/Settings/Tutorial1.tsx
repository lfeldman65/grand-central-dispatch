import { useEffect, useState, useRef } from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
const goals = require('../Settings/images/goals.png');

export default function Tutorial1(props: any) {
  //const { route } = props;
  //const { data, person, lightOrDark } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Buyer');
  const [buyerLeadSource, setBuyerLeadSource] = useState('Advertising');
  const [sellerLeadSource, setSellerLeadSource] = useState('Advertising');
  const [buyer, setBuyer] = useState<RolodexDataProps>();
  const [seller, setSeller] = useState<RolodexDataProps>();
  const [address, setAddress] = useState('TBD');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalBuyerVisible, setModalBuyerVisible] = useState(false);
  const [modalBuyerSourceVisible, setModalBuyerSourceVisible] = useState(false);
  const [modalSellerVisible, setModalSellerVisible] = useState(false);
  const [modalSellerSourceVisible, setModalSellerSourceVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Real Estate Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={nextPressed}>
          <Text style={styles.backAndNext}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    buyer,
    seller,
    status,
    type,
    buyerLeadSource,
    sellerLeadSource,
    address,
    street1,
    street2,
    city,
    state,
    zip,
  ]);

  useEffect(() => {}, [isFocused]);

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
    navigation.navigate('SettingsScreen');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.tutorialTitle}>Welcome To Referral Maker | CRM</Text>
        <Text style={styles.tutorialText}>
          Set your business goals and track your progress from a single dashboard. Access features through simple menu
          navigation.
        </Text>
      </View>
      <View style={styles.imageBox}>
        <Image source={goals} style={styles.screenImage} />
      </View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  textBox: {
    width: '100%',
    height: '30%',
    backgroundColor: 'red',
  },
  tutorialTitle: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
  tutorialText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
  },
  imageBox: {
    width: 250,
    height: 490,
    paddingTop: 20,
    alignSelf: 'center',
  },
  screenImage: {
    width: 250,
    height: 490,
    alignSelf: 'center',
  },
  backAndNext: {
    color: 'white',
    fontSize: 18,
    opacity: 1.0,
  },
});
