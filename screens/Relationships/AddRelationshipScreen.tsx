import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useIsFocused } from '@react-navigation/native';
import { addNewContact } from './api';
import SelRefScreen from './SelectReferralScreen';
import { RolodexDataProps } from './interfaces';

let deviceWidth = Dimensions.get('window').width;

export default function AddRelationshipScreen(props: any) {
  const { setModalVisible, title } = props;
  const [bizChecked, setBizCheck] = useState(false);
  const [referralChecked, setReferralChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [referral, setReferral] = useState<RolodexDataProps>();
  const [referralModalVisible, setReferralModalVisible] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    //  populateCredentialsIfRemembered();
  }, [isFocused]);

  function ReferralPressed() {
    console.log('referral pressed');
    setReferralModalVisible(true);
  }

  function SavePressed() {
    //   analytics.event(new Event('Login', 'Login Button', 'Pressed', 0));
    if (firstName == ' ' && lastName == ' ') {
      console.error('Please enter a First Name and/or Last Name');
      return;
    }
    if (bizChecked && company == '') {
      console.error('Please enter a Company Name');
      return;
    }
    console.log(company);
    addNewContact(
      firstName,
      lastName,
      bizChecked ? 'Biz' : 'Rel',
      company,
      referral == null ? '' : referral.firstName,
      referral == null ? '' : referral.id
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log(res);
          setModalVisible(false);
        }
        //   setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }
  function CancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={SavePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
        size={25}
        textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
        fillColor="#37C0FF"
        unfillColor="#004F89"
        iconStyle={{ borderColor: 'white' }}
        text="This is a Business"
        textContainerStyle={{ marginLeft: 10 }}
        style={styles.checkBox}
        onPress={(isChecked: boolean) => {
          console.log(isChecked);
          setBizCheck(!bizChecked);
        }}
      />

      {bizChecked && <Text style={styles.nameTitle}>Company</Text>}

      {bizChecked && (
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
      )}
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
            placeholder="+ Add"
            style={styles.textInput}
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            onChangeText={(text) => setLastName(text)}
            defaultValue={lastName}
          />
        </View>
      </View>

      <View style={styles.container}>
        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="This relationship is a referral"
          textContainerStyle={{ marginLeft: 10 }}
          style={styles.checkBox}
          onPress={(isChecked: boolean) => {
            console.log(isChecked);
            setReferralChecked(!referralChecked);
          }}
        />

        {referralChecked && <Text style={styles.nameTitle}>Referral</Text>}
        {referralChecked && (
          <View style={styles.mainContent}>
            <TouchableOpacity onPress={ReferralPressed}>
              <View style={styles.inputView}>
                <TextInput placeholder="Select one" placeholderTextColor="#AFB9C2" style={styles.nameLabel}>
                  {referral == null ? '' : referral.firstName}
                </TextInput>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {referralModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={referralModalVisible}
            onRequestClose={() => {
              setReferralModalVisible(!referralModalVisible);
            }}
          >
            <SelRefScreen
              title={'Select Referral'}
              setReferral={setReferral}
              setModalVisible={setReferralModalVisible}
            />
          </Modal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  inputView: {
    backgroundColor: '#002341',
    width: 0.9 * deviceWidth,
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
    placeholderText: '+ Add',
  },
  checkBox: {
    marginTop: 12,
    left: 0.055 * deviceWidth,
    marginBottom: 25,
  },
});
