import { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, lenderTypeMenu } from './transactionHelpers';
import ChooseLeadSource from './ChooseBorrowerLeadSource';
import ChooseRelationship from '../Relationships/SelectRelationshipScreen';
import { shouldRunTests } from '../../utils/general';
import { txStyles2 } from './styles';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function AddOrEditLenderTx1(props: any) {
  const { route } = props;
  const { data, person, lightOrDark } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Purchase Loan');
  const [seller, setSeller] = useState<RolodexDataProps>();
  const [borrower, setBorrower] = useState<RolodexDataProps>();
  const [borrowerLeadSource, setBorrowerLeadSource] = useState('Advertising');
  const [street1, setStreet1] = useState('TBD');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalBorrowerSourceVisible, setModalBorrowerSourceVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();
  const street1Ref = useRef<TextInput>(null);
  const street2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    navigation.setOptions({
      title: 'Lender Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={txStyles2.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={nextPressed}>
          <Text style={isDataValid() ? txStyles2.backAndNext : txStyles2.backAndNextDim}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, status, type, borrower, seller, borrowerLeadSource, street1, street2, city, state, zip, lightOrDark]);

  useEffect(() => {
    let isMounted = true;
    populateDataIfEdit(isMounted);
    if (person != null) {
      setBorrower(person);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    if (shouldRunTests()) {
      var borrower: RolodexDataProps = {
        id: '2003853e-0ae0-4144-bcc5-537c5b7c704c',
        firstName: 'Abe',
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };
      setBorrower(borrower);
    }
  }, [isFocused]);

  function handleStreet1Focus() {
    if (street1Ref != null && street1Ref.current != null) {
      street1Ref.current.focus();
    }
  }
  function handleStreet2Focus() {
    if (street2Ref != null && street2Ref.current != null) {
      street2Ref.current.focus();
    }
  }
  function handleCityFocus() {
    if (cityRef != null && cityRef.current != null) {
      cityRef.current.focus();
    }
  }
  function handleStateFocus() {
    if (stateRef != null && stateRef.current != null) {
      stateRef.current.focus();
    }
  }
  function handleZipFocus() {
    if (zipRef != null && zipRef.current != null) {
      zipRef.current.focus();
    }
  }

  function populateDataIfEdit(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    if (data != null && data.id != '') {
      setStatus(data?.status);
      setType(data?.transactionType);
      populateBorrower();
      setBorrowerLeadSource(data?.contacts[0].leadSource);
      populateAddress();
    } else {
      console.log('ADDTXMODE');
    }
  }

  function populateBorrower() {
    var txBorrower: RolodexDataProps = {
      id: data?.contacts[0].userID!,
      firstName: data.contacts[0].contactName,
      lastName: '',
      ranking: '',
      contactTypeID: '',
      employerName: '',
      qualified: false,
      selected: false,
    };
    setBorrower(txBorrower);
  }

  function populateAddress() {
    if (data != null && data?.address != null) {
      setStreet1(data?.address.street);
      setStreet2(data?.address.street2);
      setCity(data?.address.city);
      setState(data?.address.state);
      setZip(data?.address.zip);
    }
  }

  const typeMenuPressed = () => {
    const options = lenderTypeMenu;
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
          console.log('selected:' + options[selectedIndex!]);
          setType(options[selectedIndex!]);
        }
      }
    );
  };

  const statusMenuPressed = () => {
    const options = statusMenu;
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
          console.log('selected:' + options[selectedIndex!]);
          setStatus(options[selectedIndex!]);
        }
      }
    );
  };

  function borrowerSourcePressed() {
    setModalBorrowerSourceVisible(!modalBorrowerSourceVisible);
  }

  function buyerPressed() {
    console.log('Buyer Pressed');
    setModalRelVisible(!modalRelVisible);
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (borrower == null) {
      return false;
    }
    if (street1 == '') {
      return false;
    }
    return true;
  }

  function nextPressed() {
    if (borrower == null) {
      Alert.alert('Please enter a Borrower');
      return;
    }
    if (street1 == '') {
      Alert.alert('Please enter a Street');
      return false;
    }
    navigation.navigate('AddOrEditLenderTx2', {
      status: status,
      type: type,
      leadSource: borrowerLeadSource,
      borrower: borrower,
      seller: seller,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
      data: data,
      source: person == null ? 'Transactions' : 'Relationships',
    });
  }

  return (
    <ScrollView style={txStyles2.container}>
      <Text style={txStyles2.nameTitle}>Transaction Type</Text>
      <TouchableOpacity onPress={typeMenuPressed}>
        <View style={txStyles2.mainContent}>
          <View style={txStyles2.inputView}>
            <Text style={txStyles2.textInput}>{type}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={txStyles2.nameTitle}>Status</Text>
      <TouchableOpacity onPress={statusMenuPressed}>
        <View style={txStyles2.mainContent}>
          <View style={txStyles2.inputView}>
            <Text style={txStyles2.textInput}>{status}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={txStyles2.nameTitle}>Borrower *</Text>
      <TouchableOpacity onPress={buyerPressed}>
        <View style={txStyles2.mainContent}>
          <View style={txStyles2.inputView}>
            <Text style={borrower == null ? txStyles2.placeholderText : txStyles2.textInput}>
              {borrower == null ? '+ Add' : borrower?.firstName + ' ' + borrower?.lastName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {modalRelVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalRelVisible}
          onRequestClose={() => {
            setModalRelVisible(!modalRelVisible);
          }}
        >
          <ChooseRelationship
            title="Choose Relationship"
            setModalRelVisible={setModalRelVisible}
            setSelectedRel={setBorrower}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      <Text style={txStyles2.nameTitle}>Borrower Lead Source</Text>
      <TouchableOpacity onPress={borrowerSourcePressed}>
        <View style={txStyles2.mainContent}>
          <View style={txStyles2.inputView}>
            <Text style={txStyles2.textInput}>{borrowerLeadSource}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {modalBorrowerSourceVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalBorrowerSourceVisible}
          onRequestClose={() => {
            setModalRelVisible(!modalBorrowerSourceVisible);
          }}
        >
          <ChooseLeadSource
            title="Borrower Lead Source"
            setModalSourceVisible={setModalBorrowerSourceVisible}
            setSelectedSource={setBorrowerLeadSource}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      <Text style={txStyles2.nameTitle}>Street *</Text>

      <View style={txStyles2.mainContent}>
        <TouchableOpacity style={txStyles2.inputView} onPress={handleStreet1Focus}>
          <TextInput
            onPressIn={handleStreet1Focus}
            ref={street1Ref}
            style={txStyles2.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet1(text)}
            defaultValue={street1}
          />
        </TouchableOpacity>
      </View>

      <Text style={txStyles2.nameTitle}>Street 2</Text>
      <View style={txStyles2.mainContent}>
        <TouchableOpacity style={txStyles2.inputView} onPress={handleStreet2Focus}>
          <TextInput
            onPressIn={handleStreet2Focus}
            style={txStyles2.textInput}
            ref={street2Ref}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet2(text)}
            defaultValue={street2}
          />
        </TouchableOpacity>
      </View>

      <Text style={txStyles2.nameTitle}>City</Text>
      <View style={txStyles2.mainContent}>
        <TouchableOpacity style={txStyles2.inputView} onPress={handleCityFocus}>
          <TextInput
            style={txStyles2.textInput}
            onPressIn={handleCityFocus}
            ref={cityRef}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setCity(text)}
            defaultValue={city}
          />
        </TouchableOpacity>
      </View>

      <Text style={txStyles2.nameTitle}>State / Province</Text>
      <View style={txStyles2.mainContent}>
        <TouchableOpacity style={txStyles2.inputView} onPress={handleStateFocus}>
          <TextInput
            onPressIn={handleStateFocus}
            ref={stateRef}
            style={txStyles2.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setState(text)}
            defaultValue={state}
          />
        </TouchableOpacity>
      </View>

      <Text style={txStyles2.nameTitle}>Zip / Postal Code</Text>
      <View style={txStyles2.mainContent}>
        <TouchableOpacity style={txStyles2.inputView} onPress={handleZipFocus}>
          <TextInput
            onPressIn={handleZipFocus}
            ref={zipRef}
            style={txStyles2.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setZip(text)}
            defaultValue={zip}
          />
        </TouchableOpacity>
      </View>

      <View style={txStyles2.bottom}></View>
    </ScrollView>
  );
}
