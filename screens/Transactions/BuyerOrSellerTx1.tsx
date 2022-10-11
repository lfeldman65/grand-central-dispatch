import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps, AttendeesProps } from '../ToDo/interfaces';
import { TransactionTypeDataProps } from './interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, typeMenu, propertyAddressMenu, styles } from './transactionHelpers';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseLeadSource from './ChooseLeadSource';

export default function BuyerOrSellerTx(props: any) {
  const { route } = props;
  const { buyerOrSeller } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState(buyerOrSeller);
  const [buyerLeadSource, setBuyerLeadSource] = useState('Advertising');
  const [buyer, setBuyer] = useState<RolodexDataProps>();
  const [address, setAddress] = useState('TBD');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalSourceVisible, setModalSourceVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Buyer or Seller 1',
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

  function statusMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.statusSheet);
  }

  function typeMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.typeSheet);
  }

  function buyerSourcePressed() {
    setModalSourceVisible(!modalSourceVisible);
  }

  function buyerPressed() {
    console.log('Buyer Pressed');
    setModalRelVisible(!modalRelVisible);
  }

  function addressPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.addressSheet);
  }

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
    if (!isDataValid()) {
      return;
    }
    navigation.navigate('BuyerOrSellerTx2', {
      status: status,
      type: type,
      leadSource: buyerLeadSource,
      buyer: buyer,
      address: address,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
    });
  }

  function isDataValid() {
    console.log('buyer: ' + buyer);
    if (buyer == null) {
      Alert.alert('Please enter a Buyer');
      return false;
    }
    if (address == 'Enter Manually') {
      if (street1 == null || street1 == '') {
        Alert.alert('Please enter a Street');
        return false;
      }
    }
    return true;
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

      <ActionSheet // Type
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('type sheet')} // here
        id={AddTxBuyerAndSellerSheets.typeSheet} // here
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
              {Object.entries(typeMenu).map(([index, value]) => (
                <TouchableOpacity // line above
                  key={index}
                  onPress={() => {
                    SheetManager.hide(AddTxBuyerAndSellerSheets.typeSheet, null); // here
                    console.log('type: ' + value);
                    setType(value); // here
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

      <Text style={styles.nameTitle}>Buyer Lead Source</Text>
      <TouchableOpacity onPress={buyerSourcePressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <TextInput editable={false} placeholder="+ Add" placeholderTextColor="#AFB9C2" style={styles.textInput}>
              {buyerLeadSource == null ? '' : buyerLeadSource}
            </TextInput>
          </View>
        </View>
      </TouchableOpacity>
      {modalSourceVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSourceVisible}
          onRequestClose={() => {
            setModalRelVisible(!modalSourceVisible);
          }}
        >
          <ChooseLeadSource
            title="Lead Source"
            setModalSourceVisible={setModalSourceVisible}
            setSelectedSource={setBuyerLeadSource}
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Buyer</Text>
      <TouchableOpacity onPress={buyerPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={buyer == null ? styles.placeholderText : styles.textInput}>
              {buyer == null ? '+ Add' : buyer?.firstName + ' ' + buyer?.lastName}
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
            setSelectedRel={setBuyer}
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Property Address</Text>
      <TouchableOpacity onPress={addressPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{address}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet // Property Address
        initialOffsetFromBottom={10}
        onBeforeShow={(data) => console.log('type address')} // here
        id={AddTxBuyerAndSellerSheets.addressSheet} // here
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
              {Object.entries(propertyAddressMenu).map(([index, value]) => (
                <TouchableOpacity // line above
                  key={index}
                  onPress={() => {
                    SheetManager.hide(AddTxBuyerAndSellerSheets.addressSheet, null); // here
                    console.log('type: ' + value);
                    setAddress(value); // here
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

      {address == 'Enter Manually' && <Text style={styles.nameTitle}>Street</Text>}
      {address == 'Enter Manually' && (
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
      )}

      {address == 'Enter Manually' && <Text style={styles.nameTitle}>Street 2</Text>}
      {address == 'Enter Manually' && (
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
      )}

      {address == 'Enter Manually' && <Text style={styles.nameTitle}>City</Text>}
      {address == 'Enter Manually' && (
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
      )}

      {address == 'Enter Manually' && <Text style={styles.nameTitle}>State / Province</Text>}
      {address == 'Enter Manually' && (
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
      )}

      {address == 'Enter Manually' && <Text style={styles.nameTitle}>Zip / Postal Code</Text>}
      {address == 'Enter Manually' && (
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
      )}
      <View style={styles.bottom}></View>
    </ScrollView>
  );
}
