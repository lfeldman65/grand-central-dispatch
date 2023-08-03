import { useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { addNewContact } from './api';
import ChooseRelationship from './SelectRelationshipScreen';
import { RolodexDataProps } from './interfaces';
import { testForNotificationTrack } from '../Goals/handleWinNotifications';
import { getGoalData } from '../Goals/api';
import { GoalDataProps } from '../Goals/interfaces';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

let deviceWidth = Dimensions.get('window').width;

export default function AddRelationshipScreen(props: any) {
  const { setModalVisible, title, onSave, lightOrDark } = props;
  const [bizChecked, setBizCheck] = useState(false);
  const navigation = useNavigation();
  const [referralChecked, setReferralChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [referral, setReferral] = useState<RolodexDataProps>();
  const [modalRelVisible, setModalRelVisible] = useState(false);

  function referralPressed() {
    console.log('referral pressed');
    setModalRelVisible(true);
  }

  function isDataValid() {
    if (firstName == '' && lastName == '') {
      return false;
    }
    if (bizChecked && company == '') {
      return false;
    }
    if (referralChecked && referral == null) {
      return false;
    }
    return true;
  }

  function savePressed() {
    if (firstName == '' && lastName == '') {
      Alert.alert('Please enter a First Name or Last Name');
      return;
    }
    if (bizChecked && company == '') {
      Alert.alert('Please enter a Company Name');
      return;
    }
    if (referralChecked && referral == null) {
      Alert.alert('Please enter a Referral');
      return;
    }
    console.log(company);
    addNewContact(
      firstName,
      lastName,
      bizChecked ? 'Biz' : 'Rel',
      bizChecked ? company : '',
      referralChecked ? referral?.firstName : '',
      referralChecked ? referral?.id : ''
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          //  console.log(res);
          setModalVisible(false);
          afterSave(res.data[0].id);
        }
        //   setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }
  function cancelPressed() {
    setModalVisible(false);
  }

  function goToEditRel(newGuid: string) {
    navigation.navigate('RelDetails', {
      contactId: newGuid,
      firstName: firstName,
      lastName: lastName,
      lightOrDark: lightOrDark,
      goToEdit: true,
    });
  }

  function afterSave(newGuid: string) {
    console.log('aftersave');
    fetchGoals(newGuid);
    onSave();
  }

  function fetchGoals(newGuid: string) {
    getGoalData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log('fetchgoals');
          notifyIfWin(4, res.data);
          goToEditRel(newGuid);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function notifyIfWin(goalId: number, data: GoalDataProps[]) {
    console.log('GOALID: ' + goalId);
    var i = 0;
    while (i < data.length) {
      if (data[i].goal.id == goalId) {
        console.log('i: ' + i);
        testForNotificationTrack(
          data[i].goal.title,
          data[i].goal.weeklyTarget,
          data[i].achievedThisWeek,
          data[i].achievedToday
        );
      }
      i = i + 1;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={styles.saveButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>
        <TouchableOpacity onPress={savePressed}>
          <Text style={isDataValid() ? styles.saveButton : styles.saveButtonDim}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
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
              <TouchableOpacity onPress={referralPressed}>
                <View style={styles.inputView}>
                  <TextInput
                    editable={false}
                    placeholder="Select one"
                    placeholderTextColor="#AFB9C2"
                    style={styles.nameLabel}
                  >
                    {referral == null ? '' : referral.firstName + ' ' + referral.lastName}
                  </TextInput>
                </View>
              </TouchableOpacity>
            </View>
          )}

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
                title={'Choose Relationship'}
                setModalRelVisible={setModalRelVisible}
                setSelectedRel={setReferral}
                lightOrDark={lightOrDark}
              />
            </Modal>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}></View>
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
  footer: {
    height: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 20,
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
    opacity: 1.0,
  },
  saveButtonDim: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
    opacity: 0.4,
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
  checkBox: {
    marginTop: 12,
    left: 0.055 * deviceWidth,
    marginBottom: 25,
  },
});
