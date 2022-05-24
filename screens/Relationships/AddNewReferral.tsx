import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import { useIsFocused } from '@react-navigation/native';
import { addNewContact } from './api';
import { AddContactDataProps, AddContactDataResponse, RolodexDataProps } from './interfaces';

let deviceWidth = Dimensions.get('window').width;

export default function AddNewReferral(props: any) {
  const { setModalVisible, setReferral } = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState<AddContactDataResponse>();
  //const [referralLocal, setReferralLocal] = useState<RolodexDataProps>();
  //  const [referralModalVisible, setReferralModalVisible] = useState(false);

  const isFocused = useIsFocused();

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    alignItems: 'center',
  },
  nameSection: {
    //  backgroundColor: 'red',
    height: '195%',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    textAlign: 'left',
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
  },
  bottomContainer: {
    //  backgroundColor: '#1A6295',
    height: 60,
  },
  saveButton: {
    marginTop: 5,
    //  backgroundColor: 'red',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  saveText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
  },
});
