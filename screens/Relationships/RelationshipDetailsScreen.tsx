import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Button } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import { getRelDetails, getToDos, deleteRelationship, changeRankAndQual, editContact } from './api';
import { RelDetailsProps, ToDoAndApptProps } from './interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import { isNullOrEmpty } from '../../utils/general';
import { formatDate, prettyDate } from '../../utils/general';
import openMap from 'react-native-open-maps';
const chevron = require('../../images/chevron_blue_right.png');
//const suitcase = require('../Relationships/images/iconSuitcase.png'); // branch

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

const messageImg = require('../Relationships/images/relMessage.png');
const callImg = require('../Relationships/images/relCall.png');
const videoImg = require('../Relationships/images/relVid.png');
const emailImg = require('../Relationships/images/relEmail.png');
const mapImg = require('../Relationships/images/relMap.png');
const activityImg = require('../Relationships/images/relActivity.png');
const toDoImg = require('../Relationships/images/relToDo.png');
const transImg = require('../Relationships/images/relTransaction.png');
const apptImg = require('../Relationships/images/relAppt.png');
const ideasImg = require('../Relationships/images/relIdeas.png');

interface RelDetailsLocalProps {
  data: RelDetailsProps;
  route: any;
  onPress(): void;
  refresh(): void;
}
export default function RelationshipDetailsScreen(props: RelDetailsLocalProps) {
  const { route } = props;
  const { contactId, firstName, lastName } = route.params;
  const navigation = useNavigation();
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [theRank, setTheRank] = useState('D');
  const [isQual, setIsQual] = useState('False');
  const [dataDetails, setDataDetails] = useState<RelDetailsProps>();
  const [dataToDos, setDataToDos] = useState<ToDoAndApptProps[]>([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [showPersonal, setShowPersonal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showToDos, setShowToDos] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showBiz, setShowBiz] = useState(false);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    console.log('getDarkOrLight');
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function backPressed() {
    quickUpdateRankQual();
  }

  function editPressed() {
    if (dataDetails == null) return;
    navigation.navigate('EditRelationshipScreen', {
      data: dataDetails,
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={editPressed}>
          <Text style={styles.saveText}>Edit</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
    });
    navigation.setOptions({ title: fullName() });
  }, [navigation, dataDetails, theRank, isQual]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    console.log('is focused');
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchRelDetails(isMounted);
    console.log('is focused');
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchToDos(isMounted);
    console.log('is focused');
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  // function saveComplete(note: string) {
  //   console.log('save complete edit');
  // }

  function quickUpdateRankQual() {
    console.log('guid: ' + dataDetails?.id!);
    console.log('the rank: ' + theRank);

    changeRankAndQual(dataDetails?.id!, theRank, isQual)
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          Alert.alert(res.error);
        } else {
          console.log(res);
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleButtonPress(index: number) {
    console.log('button pressed');
    quickUpdateRankQual();
  }

  function handleReferralPressed() {
    console.log('referral pressed');
    navigation.navigate('RelDetails', {
      contactId: dataDetails?.referredBy.id!,
      firstName: dataDetails?.referredBy.name,
      lastName: '',
    });
  }

  function handleSpousePressed() {
    console.log('spouse pressed');
    navigation.navigate('RelDetails', {
      contactId: dataDetails?.spouse.id,
      firstName: dataDetails?.spouse.name,
      lastName: '',
    });
  }

  function handleHistoryPressed(notes: string) {
    if (notes != '') Alert.alert(notes);
  }

  function handleToDoPressed(thisEventID: string) {
    console.log(thisEventID);
  }

  function handleTransactionPressed(thisTransactionID: number) {
    console.log(thisTransactionID);
  }

  function handleGroupPressed(thisGroupID: string) {
    console.log(thisGroupID);
  }

  function showSection0() {
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.birthday)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes)) return true;
    if (!isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary)) return true;
    return false;
  }

  function showSection1() {
    if (!isNullOrEmpty(dataDetails?.historyNotes)) return true;
    return false;
  }

  function showSection2() {
    if (!isNullOrEmpty(dataToDos)) return true;
    return false;
  }

  function showSection3() {
    if (!isNullOrEmpty(dataDetails?.transactions)) return true;
    return false;
  }

  function showSection4() {
    if (!isNullOrEmpty(dataDetails?.groupsNotes)) return true;
    return false;
  }

  function showSection5() {
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes)) return true;
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.employerName)) return true;
    if (!isNullOrEmpty(dataDetails?.businessAndCareer.occupation)) return true;
    return false;
  }

  function showSection6() {
    if (!isNullOrEmpty(dataDetails?.interestsAndFavorites.notes)) {
      return true;
    }
    return false;
  }

  function handleSavePoPByPressed() {
    console.log('Save Pop-By Pressed');
  }

  function fullName() {
    console.log('biz or rel: ' + dataDetails?.contactTypeID);
    if (dataDetails?.contactTypeID == 'Biz') {
      return dataDetails.businessAndCareer.employerName;
    }
    var newFirst = '';
    var newLast = '';
    if (!isNullOrEmpty(firstName)) {
      newFirst = firstName;
    }
    if (!isNullOrEmpty(lastName)) {
      newLast = lastName;
    }
    return newFirst + ' ' + newLast;
  }

  function handleSectionTap(sectionIndex: number) {
    if (sectionIndex == 0) {
      setShowPersonal(!showPersonal);
    }
    if (sectionIndex == 1) {
      setShowActivity(!showActivity);
    }
    if (sectionIndex == 2) {
      setShowToDos(!showToDos);
    }
    if (sectionIndex == 3) {
      setShowTransactions(!showTransactions);
    }
    if (sectionIndex == 4) {
      setShowGroups(!showGroups);
    }
    if (sectionIndex == 5) {
      setShowBiz(!showBiz);
    }
    if (sectionIndex == 6) {
      setShowInterests(!showInterests);
    }
  }

  function deletePressed() {
    Alert.alert(
      'Delete ' + dataDetails?.firstName + ' ' + dataDetails?.lastName + '?',
      '',
      [
        {
          text: 'Delete',
          onPress: () => deletePressedContinue(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function deletePressedContinue() {
    console.log('delete pressed');
    setIsLoading(true);
    deleteRelationship(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          //  console.log(res.data);
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleDirectionsPressed() {
    // openMap({ latitude: 33.1175, longitude: -117.0722, zoom: 10 });
    //   openMap({ query: '7743 Royal Park Dr. Lewis Center OH 43035' });
    openMap({ query: completeAddress() });
  }

  function completeAddress() {
    var addressString = '';
    if (dataDetails?.address.street != null) {
      addressString = dataDetails?.address.street;
    }
    if (dataDetails?.address.street2 != null) {
      addressString = addressString + ' ' + dataDetails?.address.street2;
    }
    if (dataDetails?.address.city != null) {
      addressString = addressString + ' ' + dataDetails?.address.city;
    }
    if (dataDetails?.address.state != null) {
      addressString = addressString + ' ' + dataDetails?.address.state;
    }
    if (dataDetails?.address.zip != null) {
      addressString = addressString + ' ' + dataDetails?.address.zip;
    }
    return addressString;
  }

  function fetchRelDetails(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    console.log('fetch rel details');
    setIsLoading(true);
    getRelDetails(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataDetails(res.data);
          //  data = res.data;
          setTheRank(res.data.ranking);
          setIsQual(res.data.qualified);
          console.log('dataDetails:' + res.data.address.country);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function getRankButtonImage(rankPressed: string) {
    if (rankPressed == 'A+') {
      if (theRank == 'A+') {
        return aPlusSel;
      }
      return aPlusReg;
    }
    if (rankPressed == 'A') {
      if (theRank == 'A') {
        return aSel;
      }
      return aReg;
    }
    if (rankPressed == 'B') {
      if (theRank == 'B') {
        return bSel;
      }
      return bReg;
    }
    if (rankPressed == 'C') {
      if (theRank == 'C') {
        return cSel;
      }
      return cReg;
    }
    if (rankPressed == 'D') {
      if (theRank == 'D') {
        return dSel;
      }
      return dReg;
    }
  }

  function handleRankPress(rank: string) {
    console.log('rank1: ' + rank);
    //  if(theRank == 'A+')
    setTheRank(rank);
    dataDetails!.ranking = rank;
    setDataDetails(dataDetails);
  }

  function handleQualPress() {
    dataDetails!.qualified = isQual == 'False' ? 'True' : 'False';
    setIsQual(isQual == 'False' ? 'True' : 'False');
    setDataDetails(dataDetails);
  }

  function fetchToDos(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    setIsLoading(true);
    getToDos(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataToDos(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function cityStateZip(city?: string, state?: string, zip?: string) {
    var addressString = '';
    if (city != null) {
      addressString = city;
    }
    if (state != null) {
      addressString = addressString + ' ' + state;
    }
    if (zip != null) {
      addressString = addressString + ' ' + zip;
    }
    return addressString;
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={styles.topAndBottomRows}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(0)}>
            <Image source={messageImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Message</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(1)}>
            <Image source={callImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Call</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(2)}>
            <Image source={videoImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Video</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(3)}>
            <Image source={emailImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Email</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(4)}>
            <Image source={mapImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Map</Text>}
        </View>
      </View>

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

          <TouchableOpacity onPress={() => handleQualPress()}>
            <Image source={isQual == 'True' ? qualChecked : qualUnchecked} style={styles.qualButton} />
          </TouchableOpacity>
        </View>

        <Text></Text>

        <Text style={styles.subTitle}>Pop-By</Text>
        <TouchableOpacity onPress={() => handleSavePoPByPressed()}>
          <Text style={styles.phoneAndEmail}>Save</Text>
        </TouchableOpacity>

        {dataDetails?.contactTypeID == 'Biz' && <Text style={styles.subTitle}>Primary Contact</Text>}
        {dataDetails?.contactTypeID == 'Biz' && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.firstName + ' ' + dataDetails?.lastName}
          </Text>
        )}

        {!isNullOrEmpty(dataDetails?.mobile) && <Text style={styles.subTitle}>Mobile Phone Number</Text>}
        {!isNullOrEmpty(dataDetails?.mobile) && <Text style={styles.phoneAndEmail}>{dataDetails?.mobile}</Text>}

        {!isNullOrEmpty(dataDetails?.homePhone) && <Text style={styles.subTitle}>Home Phone Number</Text>}
        {!isNullOrEmpty(dataDetails?.homePhone) && <Text style={styles.phoneAndEmail}>{dataDetails?.homePhone}</Text>}

        {!isNullOrEmpty(dataDetails?.officePhone) && <Text style={styles.subTitle}>Office Phone Number</Text>}
        {!isNullOrEmpty(dataDetails?.officePhone) && (
          <Text style={styles.phoneAndEmail}>{dataDetails?.officePhone}</Text>
        )}

        {!isNullOrEmpty(dataDetails?.email) && <Text style={styles.subTitle}>Email</Text>}
        {!isNullOrEmpty(dataDetails?.email) && <Text style={styles.phoneAndEmail}>{dataDetails?.email}</Text>}

        {!isNullOrEmpty(dataDetails?.website) && <Text style={styles.subTitle}>Website</Text>}
        {!isNullOrEmpty(dataDetails?.website) && <Text style={styles.phoneAndEmail}>{dataDetails?.website}</Text>}

        {!isNullOrEmpty(dataDetails?.spouse.id) && <Text style={styles.subTitle}>Spouse</Text>}
        {!isNullOrEmpty(dataDetails?.spouse.id) && (
          <TouchableOpacity onPress={() => handleSpousePressed()}>
            <View style={styles.textAndChevronRow}>
              <View style={styles.referralAndSpouseText}>
                <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                  {dataDetails?.spouse.name}
                </Text>
              </View>

              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {!isNullOrEmpty(dataDetails?.address.street) && (
          <View style={styles.topAndBottomRows}>
            <Text style={styles.subTitle}>Location</Text>

            <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed()}>
              <Text style={styles.popByButtons}>{'Directions'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isNullOrEmpty(dataDetails?.address.street) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street}
          </Text>
        )}
        {!isNullOrEmpty(dataDetails?.address.street2) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street2}
          </Text>
        )}
        {!isNullOrEmpty(dataDetails?.address.city) &&
          !isNullOrEmpty(dataDetails?.address.state) &&
          !isNullOrEmpty(dataDetails?.address.zip) && (
            <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
              {cityStateZip(dataDetails?.address.city, dataDetails?.address.state, dataDetails?.address.zip)}
            </Text>
          )}
        {!isNullOrEmpty(dataDetails?.address.country) && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.country}
          </Text>
        )}

        <Text></Text>
        {!isNullOrEmpty(dataDetails?.notes) && <Text style={styles.subTitle}>Notes</Text>}
        {!isNullOrEmpty(dataDetails?.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.notes}</Text>
        )}

        {!isNullOrEmpty(dataDetails?.referredBy.id) && <Text style={styles.subTitle}>Referred By</Text>}
        {!isNullOrEmpty(dataDetails?.referredBy.id) && (
          <TouchableOpacity onPress={() => handleReferralPressed()}>
            <View style={styles.textAndChevronRow}>
              <View style={styles.referralAndSpouseText}>
                <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                  {dataDetails?.referredBy.name}
                </Text>
              </View>

              <View style={styles.chevronBox}>
                <Image source={chevron} style={styles.chevron} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          {showSection0() && (
            <Text style={styles.sectionText}>
              {showPersonal ? 'Hide Personal and Family' : 'Show Personal and Family'}
            </Text>
          )}
        </TouchableOpacity>

        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={styles.subTitle}>Birthday</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {prettyDate(dataDetails?.personalAndFamily.birthday!)}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={styles.subTitle}>Wedding Anniversary</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {prettyDate(dataDetails?.personalAndFamily.weddingAnniversary!)}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames) && (
          <Text style={styles.subTitle}>Children's Names</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.childrensNames) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.childrensNames}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes) && (
          <Text style={styles.subTitle}>Notes</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.personalNotes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.personalNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          {showSection1() && (
            <Text style={styles.sectionText}>{showActivity ? 'Hide Activity History' : 'Show Activity History'}</Text>
          )}
        </TouchableOpacity>
        {showActivity && showSection1() && (
          <React.Fragment>
            {dataDetails?.historyNotes.map((item, index) => (
              <TouchableOpacity onPress={() => handleHistoryPressed(dataDetails?.historyNotes[index].notes)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                      {item.activityDateTime}: {item.activityType} - {item.subject}
                    </Text>
                  </View>

                  {!isNullOrEmpty(dataDetails?.historyNotes[index].notes) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          {showSection2() && (
            <Text style={styles.sectionText}>
              {showToDos ? 'Hide To-Dos and Appointments' : 'Show To-Dos and Appointments'}
            </Text>
          )}
        </TouchableOpacity>

        {showToDos && showSection2() && (
          <React.Fragment>
            {dataToDos.map((item, index) => (
              <TouchableOpacity onPress={() => handleToDoPressed(item.EventID)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                      {item.DateToUse}: {item.Title}
                    </Text>
                  </View>

                  {!isNullOrEmpty(item.EventID) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          {showSection3() && (
            <Text style={styles.sectionText}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</Text>
          )}
        </TouchableOpacity>

        {/* { <Text style={styles.bookMark}>Bookmark</Text>} */}

        {showTransactions && showSection3() && (
          <React.Fragment>
            {dataDetails?.transactions.map((item, index) => (
              <TouchableOpacity onPress={() => handleTransactionPressed(item.dealId)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <React.Fragment>
                      <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                        {item.transactionType}
                      </Text>
                      <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
                        {item.closingDate}: {item.transactionStatus} {item.transactionName} (${item.closingPrice})
                      </Text>
                    </React.Fragment>
                  </View>

                  {!isNullOrEmpty(item.dealId) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          {showSection4() && <Text style={styles.sectionText}>{showGroups ? 'Hide Groups' : 'Show Groups'}</Text>}
        </TouchableOpacity>

        {showGroups && showSection4() && (
          <React.Fragment>
            {dataDetails?.groupsNotes.map((item, index) => (
              <TouchableOpacity onPress={() => handleGroupPressed(item.groupId)}>
                <View style={styles.textAndChevronRow}>
                  <View style={styles.referralAndSpouseText}>
                    <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{item.groupName}</Text>
                  </View>

                  {!isNullOrEmpty(item.groupId) && (
                    <View style={styles.chevronBox}>
                      <Image source={chevron} style={styles.chevron} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(5)}>
          {showSection5() && (
            <Text style={styles.sectionText}>{showBiz ? 'Hide Business and Career' : 'Show Business and Career'}</Text>
          )}
        </TouchableOpacity>
        {showBiz && showSection5() && (
          <Text style={styles.subTitle}>{dataDetails?.contactTypeID == 'Biz' ? 'Company Name' : 'Employer Name'}</Text>
        )}
        {showBiz && showSection5() && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.employerName}
          </Text>
        )}
        {showBiz &&
          !isNullOrEmpty(dataDetails?.businessAndCareer) &&
          !isNullOrEmpty(dataDetails?.businessAndCareer.occupation) && (
            <Text style={styles.subTitle}>
              {dataDetails?.contactTypeID == 'Biz' ? 'Services Provided' : 'Occupation'}
            </Text>
          )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.occupation) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.occupation}
          </Text>
        )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes) && (
          <Text style={styles.subTitle}>{dataDetails?.contactTypeID == 'Biz' ? 'Business Notes' : 'Career Notes'}</Text>
        )}
        {showBiz && !isNullOrEmpty(dataDetails?.businessAndCareer.careerNotes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.careerNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(6)}>
          {showSection6() && (
            <Text style={styles.sectionText}>
              {showInterests ? 'Hide Interests and Favorites' : 'Show Interests and Favorites'}
            </Text>
          )}
        </TouchableOpacity>
        {showInterests && !isNullOrEmpty(dataDetails?.interestsAndFavorites.notes) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.interestsAndFavorites.notes}
          </Text>
        )}
        <TouchableOpacity onPress={deletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Text></Text>
      </ScrollView>

      <View style={styles.topAndBottomRows}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(5)}>
            <Image source={activityImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Activity
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(6)}>
            <Image source={toDoImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              To-Do
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(7)}>
            <Image source={transImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Transaction
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(8)}>
            <Image source={apptImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>Appt</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress(9)}>
            <Image source={ideasImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Ideas
            </Text>
          }
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookMark: {
    fontSize: 18,
    color: 'orange',
    marginLeft: 15,
    marginBottom: 10,
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  textAndChevronRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  referralAndSpouseText: {
    width: '92%',
    paddingRight: 10,
  },
  topAndBottomRows: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  rankTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    paddingTop: 5,
    paddingRight: 20,
  },
  rankAndQualRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    paddingTop: 5,
    paddingRight: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  rankSection: {
    flexDirection: 'row',
    height: 35,
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
  directionsRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
  },
  subTitle: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 10,
  },
  scrollViewDark: {
    height: '70%',
    backgroundColor: 'black',
  },
  scrollViewLight: {
    height: '70%',
    backgroundColor: 'white',
  },
  phoneAndEmail: {
    color: '#02ABF7',
    marginLeft: 15,
    marginBottom: 10,
  },
  pair: {
    flex: 1,
    marginTop: 5,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5,
  },
  topButtonTextDark: {
    height: 16,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  topButtonTextLight: {
    height: 16,
    color: '#016497',
    textAlign: 'center',
    fontSize: 12,
  },
  bottomButtonTextDark: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  bottomButtonTextLight: {
    color: '#013273',
    textAlign: 'center',
    fontSize: 12,
  },
  namesLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
  },
  namesDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
  },
  popByButtons: {
    color: '#1398F5',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 5,
  },
  addressDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 2,
  },
  addressLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 16,
    color: '#02ABF7',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 15,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
  chevronBox: {
    alignContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    height: 18,
    width: 10,
  },
});
