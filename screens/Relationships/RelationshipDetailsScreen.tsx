import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import { getRelDetails, getToDos } from './api';
import { RelDetailsProps, ToDoAndApptProps } from './interfaces';
import { ScrollView } from 'react-native-gesture-handler';
import { isNullOrEmpty } from '../../utils/general';
import { formatDate } from '../../utils/general';

import openMap from 'react-native-open-maps';

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
  const [groupArray, setGroupArray] = useState();

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({ title: 'Relationships' });
    fetchRelDetails();
  }, [isFocused]);

  useEffect(() => {
    fetchToDos();
  }, [isFocused]);

  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: fullName() });
  }); // this will run on every render

  function handleButtonPress() {
    console.log('button pressed');
  }

  function fullName() {
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
      setShowInterests(!showInterests);
    }
    if (sectionIndex == 6) {
      setShowBiz(!showBiz);
    }
  }

  function deletePressed() {
    console.log('delete pressed');
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

  function fetchRelDetails() {
    setIsLoading(true);
    getRelDetails(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataDetails(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchToDos() {
    setIsLoading(true);
    getToDos(contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataToDos(res.data);
          console.log(res.data);
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
      <View style={styles.row}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={messageImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Message</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={callImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Call</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={videoImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Video</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={emailImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Email</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={mapImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Map</Text>}
        </View>
      </View>

      <ScrollView style={lightOrDark == 'dark' ? styles.scrollViewDark : styles.scrollViewLight}>
        <View style={lightOrDark == 'dark' ? styles.rankRowDark : styles.rankRowLight}>
          <Text style={styles.subTitle}>Ranking</Text>
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.ranking}</Text>
        </View>

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

        {!isNullOrEmpty(dataDetails?.address.street) && (
          <View style={styles.row}>
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
              {/* {dataDetails?.address.city + ', ' + dataDetails?.address.state + ' ' + dataDetails?.address.zip} */}
              {cityStateZip(dataDetails?.address.city, dataDetails?.address.state, dataDetails?.address.zip)}
            </Text>
          )}

        <Text></Text>

        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionText}>
            {showPersonal ? 'Hide Personal and Family' : 'Show Personal and Family'}
          </Text>
        </TouchableOpacity>
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={styles.subTitle}>Birthday</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.birthday) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {formatDate(dataDetails?.personalAndFamily.birthday)}
          </Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={styles.subTitle}>Wedding Anniversary</Text>
        )}
        {showPersonal && !isNullOrEmpty(dataDetails?.personalAndFamily.weddingAnniversary) && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {formatDate(dataDetails?.personalAndFamily.weddingAnniversary)}
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
          <Text style={styles.sectionText}>{showActivity ? 'Hide Activity History' : 'Show Activity History'}</Text>
        </TouchableOpacity>
        {showActivity && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.historyNotes}</Text>
        )}
        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionText}>
            {showToDos ? 'Hide To-Dos and Appointments' : 'Show To-Dos and Appointments'}
          </Text>
        </TouchableOpacity>
        {showToDos && dataToDos != null && (
          <React.Fragment>
            {dataToDos.map((item, index) => (
              <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight} key={index}>
                {item.DateToUse}: {item.Title}
              </Text>
            ))}
          </React.Fragment>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionText}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</Text>
        </TouchableOpacity>
        {showTransactions && dataDetails?.transactionNotes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.transactionNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          <Text style={styles.sectionText}>{showGroups ? 'Hide Groups' : 'Show Groups'}</Text>
        </TouchableOpacity>
        {showGroups && dataDetails?.groupsNotes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.groupsNotes}</Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(5)}>
          <Text style={styles.sectionText}>
            {showInterests ? 'Hide Interests and Favorites' : 'Show Interests and Favorites'}
          </Text>
        </TouchableOpacity>
        {showInterests && dataDetails?.interestsAndFavorites.notes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.interestsAndFavorites.notes}
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(6)}>
          <Text style={styles.sectionText}>{showBiz ? 'Hide Business and Career' : 'Show Business and Career'}</Text>
        </TouchableOpacity>
        {showBiz && <Text style={styles.subTitle}>Employer Name</Text>}
        {showBiz && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.employerName}
          </Text>
        )}
        {showBiz && <Text style={styles.subTitle}>Occupation</Text>}
        {showBiz && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.occupation}
          </Text>
        )}
        {showBiz && <Text style={styles.subTitle}>Career Notes</Text>}
        {showBiz && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.businessAndCareer.careerNotes}
          </Text>
        )}
        <TouchableOpacity onPress={deletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Text></Text>
      </ScrollView>

      <View style={styles.row}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={activityImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Activity
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={toDoImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              To-Do
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={transImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Transaction
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
            <Image source={apptImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>Appt</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => handleButtonPress()}>
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
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  rankRowDark: {
    height: 60,
    backgroundColor: 'black',
    marginBottom: 5,
    paddingTop: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  rankRowLight: {
    height: 60,
    backgroundColor: 'white',
    marginBottom: 5,
    paddingTop: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
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
  namesDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
    marginBottom: 10,
  },
  namesLight: {
    color: 'black',
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
    marginBottom: 20,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
});
