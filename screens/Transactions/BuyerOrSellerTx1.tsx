import { Fragment, useEffect, useState, useRef } from 'react';
import { Alert, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps, AttendeesProps } from '../ToDo/interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, typeMenu, propertyAddressMenu, styles } from './transactionHelpers';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseLeadSource from './ChooseLeadSource';

export default function BuyerOrSellerTx1(props: any) {
  const { route } = props;
  const { buyerOrSeller } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState(buyerOrSeller);
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

  // useEffect(() => {
  //   isDataValid();
  // }, [buyer, seller, address]);

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
          <Text style={isDataValid() ? styles.backAndNext : styles.backAndNextDim}>Next</Text>
        </TouchableOpacity>
      ),
    });
    console.log('buyer or seller: ' + buyerOrSeller);
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

  function statusMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.statusSheet);
  }

  function typeMenuPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.typeSheet);
  }

  function buyerSourcePressed() {
    setModalBuyerSourceVisible(!modalBuyerSourceVisible);
  }

  function sellerSourcePressed() {
    setModalSellerSourceVisible(!modalSellerSourceVisible);
  }

  function buyerPressed() {
    console.log('Buyer Pressed');
    setModalBuyerVisible(!modalBuyerVisible);
  }

  function sellerPressed() {
    console.log('Seller Pressed');
    setModalSellerVisible(!modalSellerVisible);
  }

  function addressPressed() {
    SheetManager.show(AddTxBuyerAndSellerSheets.addressSheet);
  }

  function backPressed() {
    navigation.goBack();
  }

  function isDataValid() {
    if (type.includes('Buyer') && buyer == null) {
      return false;
    }
    if (type.includes('Seller') && seller == null) {
      return false;
    }
    if (address == 'Enter Manually' && (street1 == '' || street1 == null)) {
      return false;
    }
    return true;
  }

  function nextPressed() {
    if (isDataValid()) {
      navigation.navigate('BuyerOrSellerTx2', {
        status: status,
        type: type,
        buyerLeadSource: buyerLeadSource,
        sellerLeadSource: sellerLeadSource,
        buyer: buyer,
        seller: seller,
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
      });
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

      {type.includes('Buyer') && <Text style={styles.nameTitle}>Buyer</Text>}
      {type.includes('Buyer') && (
        <TouchableOpacity onPress={buyerPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={buyer == null ? styles.placeholderText : styles.textInput}>
                {buyer == null ? '+ Add' : buyer?.firstName + ' ' + buyer?.lastName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {modalBuyerVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalBuyerVisible}
          onRequestClose={() => {
            setModalBuyerVisible(!modalBuyerVisible);
          }}
        >
          <ChooseRelationship
            title="Choose Relationship"
            setModalRelVisible={setModalBuyerVisible}
            setSelectedRel={setBuyer}
          />
        </Modal>
      )}

      {type.includes('Buyer') && <Text style={styles.nameTitle}>Buyer Lead Source</Text>}
      {type.includes('Buyer') && (
        <TouchableOpacity onPress={buyerSourcePressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{buyerLeadSource}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {modalBuyerSourceVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalBuyerSourceVisible}
          onRequestClose={() => {
            setModalBuyerVisible(!modalBuyerSourceVisible);
          }}
        >
          <ChooseLeadSource
            title="Buyer Lead Source"
            setModalSourceVisible={setModalBuyerSourceVisible}
            setSelectedSource={setBuyerLeadSource}
          />
        </Modal>
      )}

      {type.includes('Seller') && <Text style={styles.nameTitle}>Seller</Text>}
      {type.includes('Seller') && (
        <TouchableOpacity onPress={sellerPressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={seller == null ? styles.placeholderText : styles.textInput}>
                {seller == null ? '+ Add' : seller?.firstName + ' ' + seller?.lastName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {modalSellerVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSellerVisible}
          onRequestClose={() => {
            setModalSellerVisible(!modalSellerVisible);
          }}
        >
          <ChooseRelationship
            title="Choose Relationship"
            setModalRelVisible={setModalSellerVisible}
            setSelectedRel={setSeller}
          />
        </Modal>
      )}

      {type.includes('Seller') && <Text style={styles.nameTitle}>Seller Lead Source</Text>}
      {type.includes('Seller') && (
        <TouchableOpacity onPress={sellerSourcePressed}>
          <View style={styles.mainContent}>
            <View style={styles.inputView}>
              <Text style={styles.textInput}>{sellerLeadSource}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {modalSellerSourceVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSellerSourceVisible}
          onRequestClose={() => {
            setModalSellerVisible(!modalSellerSourceVisible);
          }}
        >
          <ChooseLeadSource
            title="Seller Lead Source"
            setModalSourceVisible={setModalSellerSourceVisible}
            setSelectedSource={setSellerLeadSource}
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
