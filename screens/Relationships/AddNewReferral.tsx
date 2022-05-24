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
});
