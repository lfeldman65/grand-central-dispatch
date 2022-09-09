import { useState, useEffect } from 'react';
import { Button, StyleSheet, ScrollView, Text, View, TextInput, Image, TouchableOpacity, Modal } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { isNullOrEmpty, prettyDate } from '../../utils/general';
import { editContact, changeRankAndQual } from './api';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddRel from './SelectRelationshipScreen';
import { RolodexDataProps, RelDetailsSpouse, RelDetailsReferredBy } from './interfaces';

const aPlusSel = require('../Relationships/images/aPlusSel.png');
const aPlusReg = require('../Relationships/images/aPlusReg.png');
const aSel = require('../Relationships/images/aSel.png');
const aReg = require('../Relationships/images/aReg.png');
const bSel = require('../Relationships/images/bSel.png');
const bReg = require('../Relationships/images/bReg.png');
const cSel = require('../Relationships/images/cSel.png');
const cReg = require('../Relationships/images/cReg.png');
const dSel = require('../Relationships/images/dSel.png');
const dReg = require('../Relationships/images/dReg.png');

const qualChecked = require('../Relationships/images/qualChecked.png');
const qualUnchecked = require('../Relationships/images/qualUnchecked.png');

export default function EditRelationshipScreen(props: any) {
  const { route } = props;
  const { data } = route.params;

  //var d : RelDetailsProps = data;

  const [lightOrDark, setIsLightOrDark] = useState('');
  const [relOrBiz, setRelOrBiz] = useState(data.contactTypeID);
  const [changeTypeButtonText, setChangeTypeButtonText] = useState('');
  const [showBirthDate, setShowBirthDate] = useState(false);
  const [showWeddingDate, setShowWeddingDate] = useState(false);
  const [theRank, setTheRank] = useState(data.ranking);
  const [isQual, setIsQual] = useState(data.qualified);
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [mobilePhone, setMobilePhone] = useState(data.mobile);
  const [homePhone, setHomePhone] = useState(data.homePhone);
  const [officePhone, setOfficePhone] = useState(data.officePhone);
  const [email, setEmail] = useState(data.email);
  const [website, setWebsite] = useState(data.website);
  const [spouse, setSpouse] = useState<RelDetailsSpouse>(data.spouse);
  const [street1, setStreet1] = useState(data.address?.street);
  const [street2, setStreet2] = useState(data.address?.street2);
  const [city, setCity] = useState(data.address?.city);
  const [state, setState] = useState(data.address?.state);
  const [zip, setZip] = useState(data.address?.zip);
  const [country, setCountry] = useState(data.address?.country);
  const [genNotes, setGenNotes] = useState(data.notes);
  const [referral, setReferral] = useState<RelDetailsReferredBy>(data.referredBy);
  const [birthday, setBirthday] = useState(prettyDate(data.personalAndFamily.birthday));
  const [wedding, setWedding] = useState(prettyDate(data.personalAndFamily.weddingAnniversary));
  const [children, setChildren] = useState(data.personalAndFamily.childrensNames);
  const [personalNotes, setPersonalNotes] = useState(data.personalAndFamily.personalNotes);
  const [company, setCompany] = useState(data.businessAndCareer.employerName);
  const [services, setServices] = useState(data.businessAndCareer.occupation);
  const [bizNotes, setBizNotes] = useState(data.businessAndCareer.careerNotes);
  const [interests, setInterests] = useState(data.interestsAndFavorites.notes);
  const [isReferral, setIsReferral] = useState(data.referral);
  const [modalRelVisible, setModalRelVisible] = useState(false);
  const [modalSpouseVisible, setModalSpouseVisibile] = useState(false);

  const [date, setDate] = useState(new Date());

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const onDatePickerBdayChange = (event: any, selectedDate: any) => {
    setBirthday(
      selectedDate.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    );
  };

  const onDatePickerWeddingChange = (event: any, selectedDate: any) => {
    setWedding(
      selectedDate.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    );
  };

  // function saveComplete() {
  //   console.log('save complete');
  // }

  function showBirthDatePicker() {
    console.log('show birthday picker');
    setShowBirthDate(true);
  }

  function showWeddingDatePicker() {
    console.log('show wedding picker');
    setShowWeddingDate(true);
  }

  function changeType() {
    console.log('isBiz: ' + relOrBiz);
    setRelOrBiz(relOrBiz == 'Biz' ? 'Rel' : 'Biz');
    setChangeTypeButtonText(relOrBiz == 'Biz' ? 'Change to Relationship' : 'Change to Business');
  }

  function handleRefPressed() {
    setModalRelVisible(!modalRelVisible);
  }

  function handleSpousePressed() {
    setModalSpouseVisibile(!modalSpouseVisible);
  }

  function savePressed() {
    console.log('edit save pressed');
    console.log('mobile: ' + mobilePhone);
    updateContact();
  }

  function backPressed() {
    console.log('back pressed');
    //   navigation.goBack();
    quickUpdateRankQual();
  }

  function setReferredFromModal(user: RolodexDataProps) {
    console.log('userId1: ' + user.id);
    console.log('userFirst: ' + user.firstName);
    let dp: RelDetailsReferredBy = {
      id: user.id,
      name: user.firstName,
    };
    console.log('referredBy ' + referral.name);

    setReferral(dp);
  }

  function setSpouseFromModal(user: RolodexDataProps) {
    console.log('userId2: ' + user.id);
    console.log(user.firstName);
    let dp: RelDetailsSpouse = {
      id: user.id,
      name: user.firstName,
    };

    setSpouse(dp);
  }

  function updateContact() {
    editContact(
      data?.id,
      theRank,
      isQual,
      firstName,
      lastName,
      mobilePhone,
      homePhone,
      officePhone,
      email,
      website,
      street1,
      street2,
      city,
      state,
      zip,
      country,
      genNotes,
      relOrBiz,
      children,
      personalNotes,
      company,
      services,
      bizNotes,
      interests,
      spouse,
      referral,
      birthday,
      wedding
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
        } else {
          navigation.goBack();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    theRank,
    isQual,
    firstName,
    lastName,
    mobilePhone,
    homePhone,
    officePhone,
    email,
    website,
    spouse,
    street1,
    street2,
    city,
    state,
    zip,
    country,
    genNotes,
    relOrBiz,
    children,
    personalNotes,
    company,
    services,
    bizNotes,
    interests,
    referral,
    birthday,
    wedding,
  ]);

  function getRankButtonImage(rank: string) {
    if (rank == 'A+') {
      if (theRank == 'A+') {
        return aPlusSel;
      }
      return aPlusReg;
    }
    if (rank == 'A') {
      if (theRank == 'A') {
        return aSel;
      }
      return aReg;
    }
    if (rank == 'B') {
      if (theRank == 'B') {
        return bSel;
      }
      return bReg;
    }
    if (rank == 'C') {
      if (theRank == 'C') {
        return cSel;
      }
      return cReg;
    }
    if (rank == 'D') {
      if (theRank == 'D') {
        return dSel;
      }
      return dReg;
    }
  }

  function removeSpousePressed() {
    let dp: RelDetailsSpouse = {
      id: '',
      name: '',
    };
    setSpouse(dp);
  }

  function removeReferralPressed() {
    let dp: RelDetailsReferredBy = {
      id: '',
      name: '',
    };
    setReferral(dp);
  }

  function spousePressed() {
    console.log('spouse pressed');
    handleSpousePressed();
  }

  function referralPressed() {
    console.log('referral pressed');
    handleRefPressed();
  }

  useEffect(() => {
    var text = 'Change to Business';
    if (relOrBiz == 'Biz') {
      var text = 'Change to Relationship';
    }
    setChangeTypeButtonText(text);
  }, [relOrBiz]);

  function handleRankPress(rank: string) {
    console.log('rank1: ' + rank);
    setTheRank(rank);
    console.log('rank after: ' + theRank);
  }

  function quickUpdateRankQual() {
    console.log('guid: ' + data.id);
    console.log('the rank: ' + theRank);

    changeRankAndQual(data?.id!, theRank, isQual)
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          //   Alert.alert(res.error);
        } else {
          console.log(res);
          navigation.goBack();
        }
        //  setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleQualPress(qualParameter: string) {
    console.log('qual param:' + qualParameter);
    console.log('qual:' + isQual);
    if (qualParameter == 'True') {
      setIsQual('False');
    } else {
      setIsQual('True');
    }
    console.log('qual output: ' + isQual);
  }

  function fullName() {
    if (relOrBiz == 'Biz') {
      return data.businessAndCareer.employerName;
    }
    var newFirst = '';
    var newLast = '';
    if (!isNullOrEmpty(data?.firstName)) {
      newFirst = data.firstName;
    }
    if (!isNullOrEmpty(data?.lastName)) {
      newLast = data.lastName;
    }
    return newFirst + ' ' + newLast;
  }

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    navigation.setOptions({ title: fullName() });
    if (relOrBiz == 'Biz') {
      setChangeTypeButtonText('Change to Relationship');
    } else {
      setChangeTypeButtonText('Change to Business');
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    if (relOrBiz == 'Biz') {
      setChangeTypeButtonText('Change to Relationship');
    } else {
      setChangeTypeButtonText('Change to Business');
    }
    navigation.setOptions({ title: fullName() });
  }, [relOrBiz]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  return (
    <ScrollView style={lightOrDark == 'dark' ? styles.scrollViewDark : styles.scrollViewLight}>
      <View style={styles.rankTitleRow}>
        <Text style={styles.subTitle}>Ranking</Text>
        <Text style={styles.subTitle}>Qualified</Text>
      </View>

      <View style={styles.rankAndQualRow}>
        <View style={lightOrDark == 'dark' ? styles.rankSection : styles.rankSection}>
          <TouchableOpacity onPress={() => handleRankPress('A+')}>
            <Image source={getRankButtonImage('A+')} style={styles.rankButton} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleRankPress('A')}>
            <Image source={getRankButtonImage('A')} style={styles.rankButton} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleRankPress('B')}>
            <Image source={getRankButtonImage('B')} style={styles.rankButton} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleRankPress('C')}>
            <Image source={getRankButtonImage('C')} style={styles.rankButton} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleRankPress('D')}>
            <Image source={getRankButtonImage('D')} style={styles.rankButton} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleQualPress(isQual)}>
          <Image source={isQual == 'True' ? qualChecked : qualUnchecked} style={styles.qualButton} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider}></View>
      <View style={styles.textAndButtonRow}>
        <Text style={styles.subTitle}>Type</Text>
        <TouchableOpacity style={styles.inlineButtons} onPress={changeType}>
          <Text style={styles.inlineButtons}>{changeTypeButtonText}</Text>
        </TouchableOpacity>
      </View>
      <Text style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}>
        {relOrBiz == 'Biz' ? 'Business' : 'Relationship'}
      </Text>

      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>First Name</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setFirstName(text)}
        defaultValue={firstName}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Last Name</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setLastName(text)}
        defaultValue={lastName}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Mobile Phone Number</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setMobilePhone(text)}
        defaultValue={mobilePhone}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Home Phone Number</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setHomePhone(text)}
        defaultValue={homePhone}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Office Phone Number</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setOfficePhone(text)}
        defaultValue={officePhone}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Email</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setEmail(text)}
        defaultValue={email}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Website</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setWebsite(text)}
        defaultValue={website}
      />
      <View style={styles.divider}></View>

      <View style={styles.textAndButtonRow}>
        <Text style={styles.subTitle}>Spouse</Text>
        {spouse != null && spouse.id != '' && spouse.id != null && (
          <TouchableOpacity style={styles.inlineButtons} onPress={removeSpousePressed}>
            <Text style={styles.inlineButtons}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={spousePressed}>
        <View style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}>
          {spouse != null && spouse.id != '' && spouse.id != null && <Text>{spouse.name}</Text>}
          {(spouse == null || spouse.id == '' || spouse.id == null) && <Text style={styles.addText}>+Add</Text>}
        </View>
      </TouchableOpacity>

      {modalSpouseVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSpouseVisible}
          onRequestClose={() => {
            setModalSpouseVisibile(!modalSpouseVisible);
          }}
        >
          <AddRel
            title={'Select Relationship'}
            setReferral={setSpouseFromModal}
            setModalVisible={setModalSpouseVisibile}
          />
        </Modal>
      )}

      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Street</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setStreet1(text)}
        defaultValue={street1}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Street 2</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setStreet2(text)}
        defaultValue={street2}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>City</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setCity(text)}
        defaultValue={city}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>State/Province</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setState(text)}
        defaultValue={state}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Zip/Postal Code</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setZip(text)}
        defaultValue={zip}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Country</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setCountry(text)}
        defaultValue={country}
      />
      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Notes</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setGenNotes(text)}
        defaultValue={genNotes}
      />
      <View style={styles.divider}></View>

      <View style={styles.textAndButtonRow}>
        <Text style={styles.subTitle}>Referred By</Text>
        {referral != null && referral.id != '' && referral.id != null && (
          <TouchableOpacity style={styles.inlineButtons} onPress={removeReferralPressed}>
            <Text style={styles.inlineButtons}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={referralPressed}>
        <View style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}>
          {referral != null && referral.id != '' && referral.id != null && <Text>{referral.name}</Text>}
          {(referral == null || referral.id == '' || referral.id == null) && <Text style={styles.addText}>+Add</Text>}
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
          <AddRel
            title={'Select Relationship'}
            setReferral={setReferredFromModal}
            setModalVisible={setModalRelVisible}
          />
        </Modal>
      )}

      <View style={styles.divider}></View>
      <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Personal And Family</Text>
      <View style={styles.divider}></View>

      <Text style={styles.subTitle}>Birthday</Text>
      <TouchableOpacity onPress={showBirthDatePicker}>
        <View style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}>
          {birthday != null && birthday != '' && <Text>{birthday}</Text>}
          {(birthday == null || birthday == '') && <Text style={styles.addText}>+Add</Text>}
        </View>
      </TouchableOpacity>

      {showBirthDate && (
        <TouchableOpacity
          onPress={() => {
            setShowBirthDate(false);
          }}
        >
          <Text style={styles.closePicker}>Close</Text>
        </TouchableOpacity>
      )}

      {showBirthDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(birthday)}
          mode={'date'}
          is24Hour={true}
          onChange={onDatePickerBdayChange}
          display="spinner"
          textColor={lightOrDark == 'dark' ? 'white' : 'black'}
        />
      )}
      <View style={styles.divider}></View>

      <Text style={styles.subTitle}>Wedding</Text>
      <TouchableOpacity onPress={showWeddingDatePicker}>
        <View style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}>
          {wedding != null && wedding != '' && <Text>{wedding}</Text>}
          {(wedding == null || wedding == '') && <Text style={styles.addText}>+Add</Text>}
        </View>
      </TouchableOpacity>

      {showWeddingDate && (
        <TouchableOpacity
          onPress={() => {
            setShowWeddingDate(false);
          }}
        >
          <Text style={styles.closePicker}>Close</Text>
        </TouchableOpacity>
      )}

      {showWeddingDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(wedding)}
          mode={'date'}
          is24Hour={true}
          onChange={onDatePickerWeddingChange}
          display="spinner"
          textColor={lightOrDark == 'dark' ? 'white' : 'black'}
        />
      )}
      <View style={styles.divider}></View>

      <Text style={styles.subTitle}>Children's Names</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setChildren(text)}
        defaultValue={children}
      />

      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>Personal And Family Notes</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setPersonalNotes(text)}
        defaultValue={personalNotes}
      />

      <View style={styles.divider}></View>
      <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Business And Career</Text>
      <View style={styles.divider}></View>

      <Text style={styles.subTitle}>{relOrBiz == 'Biz' ? 'Company Name' : 'Employer Name'}</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setCompany(text)}
        defaultValue={company}
      />

      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>{relOrBiz == 'Biz' ? 'Services Provided' : 'Occupation'}</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setServices(text)}
        defaultValue={services}
      />

      <View style={styles.divider}></View>
      <Text style={styles.subTitle}>{relOrBiz == 'Biz' ? 'Business Notes' : 'Career Notes'}</Text>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setBizNotes(text)}
        defaultValue={bizNotes}
      />

      <View style={styles.divider}></View>
      <Text style={lightOrDark == 'dark' ? styles.headerDark : styles.headerLight}>Interests And Favorites</Text>
      <View style={styles.divider}></View>
      <TextInput
        style={lightOrDark == 'dark' ? styles.textInputDark : styles.textInputLight}
        placeholder="+Add"
        placeholderTextColor="#AFB9C2"
        secureTextEntry={false}
        onChangeText={(text) => setInterests(text)}
        defaultValue={interests}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: 5,
  },
  closePicker: {
    textAlign: 'center',
    fontSize: 18,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewDark: {
    backgroundColor: 'black',
  },
  scrollViewLight: {
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  inlineButtons: {
    color: '#F99055',
    fontSize: 16,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 5,
  },
  textAndButtonRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  rankTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    marginTop: 15,
    paddingRight: 20,
  },
  rankAndQualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    paddingRight: 20,
  },
  rankSection: {
    flexDirection: 'row',
    height: 35,
  },
  subTitle: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 10,
  },
  rankButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
  qualButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
  inputViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'red',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInputDark: {
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
    marginBottom: 10,
  },
  textInputLight: {
    fontSize: 16,
    color: 'black',
    marginLeft: 15,
    marginBottom: 10,
  },
  headerDark: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
    marginBottom: 10,
  },
  headerLight: {
    fontSize: 18,
    color: 'black',
    marginLeft: 15,
    marginBottom: 10,
  },
  addText: {
    fontSize: 16,
    color: '#AFB9C2',
  },
});
