import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps, AttendeesProps } from '../ToDo/interfaces';
import {
  AddTxBuyerAndSellerSheets,
  statusMenu,
  typeMenu,
  buyerLeadSourceMenu,
  propertyAddressMenu,
  styles,
} from './transactionHelpers';

export default function AddTxBuyer1(props: any) {
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Buyer');
  const [buyerLeadSource, setBuyerLeadSource] = useState('Advertising');
  const [buyer, setBuyer] = useState<RolodexDataProps>();
  const [address, setAddress] = useState('TBD');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Buyer Details',
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
  }, [navigation, buyer, status, type, buyerLeadSource, address, street1, street2, city, state, zip]);

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
    // navigation.navigate('AddTxBuyer2', {
    //   status: status,
    //   type: type,
    //   leadSource: buyerLeadSource,
    //   buyer: buyer,
    //   address: address,
    //   street1: street1,
    //   street2: street2,
    //   city: city,
    //   state: state,
    //   zip: zip,
    // });
  }

  return <ScrollView style={styles.container}></ScrollView>;
}
