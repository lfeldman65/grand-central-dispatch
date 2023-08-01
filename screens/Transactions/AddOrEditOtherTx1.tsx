import { useEffect, useState, useRef } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, styles } from './transactionHelpers';
import ChooseOtherTxType from './ChooseOtherTxType';
import ChooseRelationship from '../Relationships/SelectRelationshipScreen';

const closeButton = require('../../images/button_close_white.png');

export default function AddOrEditOtherTx1(props: any) {
  const { route } = props;
  const { data, person, lightOrDark } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Lease');
  const [txTitle, setTxTitle] = useState('');
  const [whoInvolved, setWhoInvolved] = useState<RolodexDataProps[]>([]);
  const [street1, setStreet1] = useState('TBD');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalTypeVisible, setModalTypeVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();
  const titleRef = useRef<TextInput>(null);
  const street1Ref = useRef<TextInput>(null);
  const street2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Other Transaction',
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={nextPressed}>
          <Text style={isDataValid() ? styles.backAndNext : styles.backAndNextDim}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, status, type, txTitle, whoInvolved, street1, street2, city, state, zip, data]);

  useEffect(() => {
    let isMounted = true;
    populateDataIfEdit(isMounted);
    if (person != null) {
      console.log('PERSON:' + person.firstName);
      setWhoInvolved([person]);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    var now = new Date();
    const timeString = now.toLocaleTimeString();
    console.log('now:' + timeString.toString());
    //  setTxTitle(timeString.toString());
  }, [isFocused]);

  function handleTitleFocus() {
    if (titleRef != null && titleRef.current != null) {
      titleRef.current.focus();
    }
  }
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

  function handleSelectedWhoInvolved(selected: RolodexDataProps) {
    var toBeRemoved = new Array();
    const combined = [...whoInvolved, ...[selected]];
    combined.forEach((item, index) => {
      // remove duplicates
      console.log('in loop');
      console.log(whoInvolved);
      combined.forEach((item2, index2) => {
        console.log('in 2nd loop');
        console.log('item id: ' + item.id);
        console.log('item2 id: ' + item2.id);
        if (item.id == item2.id && index != index2) combined.splice(index2, 1);
      });
    });
    setWhoInvolved(combined);
  }

  function populateDataIfEdit(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    if (data != null && data?.id != '') {
      setStatus(data?.status);
      setType(data?.transactionType);
      setTxTitle(data?.title);
      populateWho();
      populateAddress();
    } else {
      console.log('ADDTXMODE');
    }
  }

  function handleWhoPressed() {
    console.log('who pressed');
    setModalRelVisible(!modalRelVisible);
  }

  function populateWho() {
    var who: RolodexDataProps[] = [];
    data?.contacts.forEach((item: any, index: number) => {
      var txWho: RolodexDataProps = {
        id: item.userID,
        firstName: item.contactName,
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };
      who.push(txWho);
    });
    setWhoInvolved(who);
  }

  function deleteWhoInvolved(index: number) {
    console.log(index);
    whoInvolved.splice(index, 1);
    const newWhoInvolved = [...whoInvolved, ...[]];
    setWhoInvolved(newWhoInvolved);
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

  function statusMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.statusSheet);
  }

  function typeMenuPressed() {
    setModalTypeVisible(!modalTypeVisible);
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (txTitle == '') {
      return false;
    }
    if (whoInvolved[0] == null) {
      return false;
    }
    return true;
  }

  function nextPressed() {
    if (txTitle == '') {
      Alert.alert('Please enter a Title');
      return;
    }
    if (whoInvolved[0] == null) {
      Alert.alert('Please enter at least one Relationship');
      return false;
    }
    navigation.navigate('AddOrEditOtherTx2', {
      status: status,
      title: txTitle,
      type: type,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
      whoInvolved: whoInvolved,
      data: data,
      source: person == null ? 'Transactions' : 'Relationships',
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.nameTitle}>Status</Text>
      <TouchableOpacity onPress={statusMenuPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{status}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet // Status
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('status sheet')} // here
        id={AddTxBuyerAndSellerSheets.statusSheet} // here
        ref={actionSheetRef}
        statusBarTranslucent
        bounceOnOpen={true}
        drawUnderStatusBar={false}
        bounciness={4}
        gestureEnabled={true}
        bottomOffset={40}
        defaultOverlayOpacity={0.4}
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
            style={globalStyles.filterView}
          >
            <View>
              {Object.entries(statusMenu).map(([index, value]) => (
                <TouchableOpacity // line above
                  key={index}
                  onPress={() => {
                    SheetManager.hide(AddTxBuyerAndSellerSheets.statusSheet, null); // here
                    console.log('filter: ' + value);
                    setStatus(value); // here
                    // fetchData();
                  }}
                  style={globalStyles.listItemCell}
                >
                  <Text style={globalStyles.listItem}>{index}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ActionSheet>

      <Text style={styles.nameTitle}>Transaction Type</Text>
      <TouchableOpacity onPress={typeMenuPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{type}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {modalTypeVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalTypeVisible}
          onRequestClose={() => {
            setModalTypeVisible(!modalTypeVisible);
          }}
        >
          <ChooseOtherTxType
            title="Other Tx Type"
            setModalTypeVisible={setModalTypeVisible}
            setSelectedType={setType}
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Title *</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleTitleFocus}>
          <TextInput
            onPressIn={handleTitleFocus}
            ref={titleRef}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setTxTitle(text)}
            defaultValue={txTitle}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameTitle}>Relationships *</Text>

      {whoInvolved.map((item, index) => (
        <View style={styles.mainContent}>
          <View style={styles.attendeeView}>
            <Text style={styles.attendeeInput}>{item.firstName}</Text>
            <TouchableOpacity key={index} onPress={() => deleteWhoInvolved(index)}>
              <Image source={closeButton} style={styles.deleteAttendeeX} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <Text style={styles.addAttendee} onPress={handleWhoPressed}>
            + Add
          </Text>
        </View>
      </View>

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
            setSelectedRel={handleSelectedWhoInvolved}
            lightOrDark={lightOrDark}
            // allowMultipleSelects={true}
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Street *</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleStreet1Focus}>
          <TextInput
            onPressIn={handleStreet1Focus}
            ref={street1Ref}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet1(text)}
            defaultValue={street1}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameTitle}>Street 2</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleStreet2Focus}>
          <TextInput
            onPressIn={handleStreet2Focus}
            ref={street2Ref}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setStreet2(text)}
            defaultValue={street2}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameTitle}>City</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleCityFocus}>
          <TextInput
            onPressIn={handleCityFocus}
            ref={cityRef}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setCity(text)}
            defaultValue={city}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameTitle}>State / Province</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleStateFocus}>
          <TextInput
            onPressIn={handleStateFocus}
            ref={stateRef}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setState(text)}
            defaultValue={state}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameTitle}>Zip / Postal Code</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.inputView} onPress={handleZipFocus}>
          <TextInput
            onPressIn={handleZipFocus}
            ref={zipRef}
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setZip(text)}
            defaultValue={zip}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}></View>
    </ScrollView>
  );
}
