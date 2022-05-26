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

  function savePressed() {
    //   analytics.event(new Event('Login', 'Login Button', 'Pressed', 0));
    if (firstName == ' ' && lastName == ' ') {
      console.error('Please enter a First Name and/or Last Name');
      return;
    }
    addNewContact(
      firstName,
      lastName,
      '', // bizChecked
      '' // company
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log(res);

          let dp: RolodexDataProps = {
            id: res.data[0].id,
            firstName: res.data[0].firstName,
            lastName: res.data[0].lastName,
            ranking: '',
            contactTypeID: '',
            employerName: '',
          };

          setReferral(dp);
          setModalVisible(false);
        }
        //   setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.nameSection}>
        <Text></Text>
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
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              onChangeText={(text) => setLastName(text)}
              defaultValue={lastName}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.bottomContainer} onPress={() => savePressed()}>
        <View style={styles.saveButton}>
          <Text style={styles.saveText}>{'Save'}</Text>
        </View>
      </TouchableOpacity>
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
  nameSection: {
    height: '80%', // android (80% is the best i can do and it's off) ios: 195%
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
    height: 64,
  },
  saveButton: {
    marginTop: 5,
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
