import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
import {
  AddTxBuyerAndSellerSheets,
  statusMenu,
  purchaseLoanTypeMenu,
  propertyAddressMenu,
  styles,
} from './transactionHelpers';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseLeadSource from './ChooseBorrowerLeadSource';

export default function AddOrEditLenderTx1(props: any) {
  const { route } = props;
  const { loanOrRefi } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState(loanOrRefi);
  const [borrower, setBorrower] = useState<RolodexDataProps>();
  const [borrowerLeadSource, setBorrowerLeadSource] = useState('Advertising');
  const [address, setAddress] = useState('TBD');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalBorrowerSourceVisible, setModalBorrowerSourceVisible] = useState(false);
  const isFocused = useIsFocused();
  const actionSheetRef = useRef<ActionSheet>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Lender Transaction',
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
  }, [navigation, status, type, borrower, borrowerLeadSource, address, street1, street2, city, state, zip]);

  function statusMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.statusSheet);
  }

  function typeMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.purchaseLoanTypeSheet);
  }

  function borrowerSourcePressed() {
    setModalBorrowerSourceVisible(!modalBorrowerSourceVisible);
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

  function isDataValid() {
    if (borrower == null) {
      return false;
    }
    return true;
  }

  function nextPressed() {
    if (isDataValid()) {
      // navigation.navigate('AddOrEditLenderTx2', {
      //   status: status,
      //   type: type,
      //   leadSource: borrowerLeadSource,
      //   borrower: borrower,
      //   address: address,
      //   street1: street1,
      //   street2: street2,
      //   city: city,
      //   state: state,
      //   zip: zip,
      // });
    }
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
        onBeforeShow={(data) => console.log('tx type sheet')} // here
        id={AddTxBuyerAndSellerSheets.purchaseLoanTypeSheet} // here
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
              {Object.entries(purchaseLoanTypeMenu).map(([index, value]) => (
                <TouchableOpacity // line above
                  key={index}
                  onPress={() => {
                    SheetManager.hide(AddTxBuyerAndSellerSheets.purchaseLoanTypeSheet, null); // here
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

      <Text style={styles.nameTitle}>Borrower</Text>
      <TouchableOpacity onPress={buyerPressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={borrower == null ? styles.placeholderText : styles.textInput}>
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
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Borrower Lead Source</Text>
      <TouchableOpacity onPress={borrowerSourcePressed}>
        <View style={styles.mainContent}>
          <View style={styles.inputView}>
            <Text style={styles.textInput}>{borrowerLeadSource}</Text>
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
