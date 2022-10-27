import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, propertyAddressMenu, styles } from './transactionHelpers';
import ChooseOtherTxType from './ChooseOtherTxType';
import ChooseRelationship from '../Goals/ChooseRelationship';

const closeButton = require('../../images/button_close_white.png');

export default function AddOrEditOtherTx1(props: any) {
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Lease');
  const [txTitle, setTxTitle] = useState('10.25');
  const [whoInvolved, setWhoInvolved] = useState<RolodexDataProps>();
  const [address, setAddress] = useState('TBD');
  const [street1, setStreet1] = useState('577');
  const [street2, setStreet2] = useState('202');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalTypeVisible, setModalTypeVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

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
          <Text style={styles.backAndNext}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, status, type, txTitle, whoInvolved, street1, street2, city, state, zip]);

  function handleWhoPressed() {
    console.log('who pressed');
    setModalRelVisible(!modalRelVisible);
  }

  function statusMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.statusSheet);
  }

  function typeMenuPressed() {
    setModalTypeVisible(!modalTypeVisible);
  }

  function addressPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.addressSheet);
  }

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
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
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Title</Text>
      <View style={styles.mainContent}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setTxTitle(text)}
            defaultValue={txTitle}
          />
        </View>
      </View>

      <Text style={styles.nameTitle}>Who's Involved</Text>
      <TouchableOpacity onPress={handleWhoPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={whoInvolved == null ? styles.placeholderText : styles.textInput}>
              {whoInvolved == null ? '+ Add' : whoInvolved?.firstName + ' ' + whoInvolved?.lastName}
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
            setSelectedRel={setWhoInvolved}
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
