import { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { RolodexDataProps } from '../ToDo/interfaces';
import { AddTxBuyerAndSellerSheets, statusMenu, typeMenu, styles } from './transactionHelpers';
import ChooseRelationship from '../Goals/ChooseRelationship';
import ChooseLeadSource from './ChooseLeadSource';

export default function AddOrEditRealtorTx1(props: any) {
  const { route } = props;
  const { data, person, lightOrDark } = route.params;
  const [status, setStatus] = useState('Potential');
  const [type, setType] = useState('Buyer');
  const [buyerLeadSource, setBuyerLeadSource] = useState('Advertising');
  const [sellerLeadSource, setSellerLeadSource] = useState('Advertising');
  const [buyer, setBuyer] = useState<RolodexDataProps>();
  const [seller, setSeller] = useState<RolodexDataProps>();
  const [street1, setStreet1] = useState('TBD');
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
  const street1Ref = useRef<TextInput>(null);
  const street2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);

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
  }, [
    navigation,
    buyer,
    seller,
    status,
    type,
    buyerLeadSource,
    sellerLeadSource,
    street1,
    street2,
    city,
    state,
    zip,
    data,
    lightOrDark,
  ]);

  useEffect(() => {
    if (person != null) {
      if (type.includes('Buyer')) {
        setBuyer(person);
      }
      if (type.includes('Seller')) {
        setSeller(person);
      }
    }
  }, [type]);

  useEffect(() => {
    let isMounted = true;
    populateDataIfEdit(isMounted);
    if (person != null) {
      setBuyer(person);
    }
    return () => {
      isMounted = false;
    };
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
      populateBuyerSeller(data?.transactionType);
      populateTypeAndSources(data?.transactionType);
      populateAddress();
    } else {
      console.log('ADDTXMODE');
    }
  }

  function populateBuyerSeller(typeTX: string) {
    if (typeTX == 'Buyer & Seller') {
      var txSeller: RolodexDataProps = {
        id: data?.contacts[0].userID!,
        firstName: data.contacts[0].contactName,
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };
      var txBuyer: RolodexDataProps = {
        id: data?.contacts[1].userID!,
        firstName: data.contacts[1].contactName,
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };

      setSeller(txSeller);
      setBuyer(txBuyer);
    } else if (typeTX == 'Buyer') {
      var txBuyer: RolodexDataProps = {
        id: data?.contacts[0].userID!,
        firstName: data.contacts[0].contactName,
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };
      setBuyer(txBuyer);
    } else {
      var txSeller: RolodexDataProps = {
        id: data?.contacts[0].userID!,
        firstName: data.contacts[0].contactName,
        lastName: '',
        ranking: '',
        contactTypeID: '',
        employerName: '',
        qualified: false,
        selected: false,
      };
      setSeller(txSeller);
    }
  }

  function populateTypeAndSources(typeTX: string) {
    if (typeTX == 'Buyer & Seller') {
      setSellerLeadSource(data?.contacts[0].leadSource);
      setBuyerLeadSource(data?.contacts[1].leadSource);
    } else if (typeTX == 'Buyer') {
      setBuyerLeadSource(data?.contacts[0].leadSource);
    } else {
      setSellerLeadSource(data?.contacts[0].leadSource);
    }
  }

  function populateAddress() {
    console.log('populate address');
    if (data?.address != null) {
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
    return true;
  }

  function nextPressed() {
    if (isDataValid()) {
      navigation.navigate('AddOrEditRealtorTx2', {
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
        data: data,
        source: person == null ? 'Transactions' : 'Relationships',
      });
    }
  }

  return (
    <ScrollView style={styles.container}>
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

      {type.includes('Buyer') && <Text style={styles.nameTitle}>{'Buyer*'}</Text>}
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
            lightOrDark={lightOrDark}
            allowMultipleSelects={false}
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
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      {type.includes('Seller') && <Text style={styles.nameTitle}>Seller*</Text>}
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
            lightOrDark={lightOrDark}
          />
        </Modal>
      )}

      <Text style={styles.nameTitle}>Street</Text>
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
