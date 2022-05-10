import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import { getRelDetails, getToDos } from './api';
import { RelDetailsProps, ToDoAndApptProps } from './interfaces';
import { ScrollView } from 'react-native-gesture-handler';

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
    FetchRelDetails();
  }, [isFocused]);

  useEffect(() => {
    FetchToDos();
  }, [isFocused]);

  useEffect(() => {
    //contact name will be initially be blank, when data is received
    //render happens again and will run everything in this function again
    navigation.setOptions({ title: FullName() });
  }); // this will run on every render

  function HandleButtonPress() {
    console.log('button pressed');
  }

  function FullName() {
    var newFirst = '';
    var newLast = '';
    if (firstName != null) {
      newFirst = firstName;
    }
    if (lastName != null) {
      newLast = lastName;
    }
    return newFirst + ' ' + newLast;
  }

  function HandleSectionTap(sectionIndex: number) {
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

  function PrettyDate(uglyDate: string) {
    var dateOnly = uglyDate.substring(0, 10);
    var dateParts = dateOnly.split('-');
    console.log(dateParts[0]);
    var year = dateParts[0].substring(2, 4);
    return dateParts[1] + '/' + dateParts[2] + '/' + year;
  }

  function DeletePressed() {
    console.log('delete pressed');
  }

  function FetchRelDetails() {
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

  function FetchToDos() {
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

  function FormatToDos(date: string, title: string) {
    if (date == null || date == '') {
      return '';
    }
    if (title == null || title == '') {
      return '';
    }
    return date + ': ' + title;
  }

  function CityStateZip(city: string, state: string, zip: string) {
    var addressString = '';
    if (city != null) {
      addressString = addressString + ' ' + city;
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
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={messageImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Message</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={callImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Call</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={videoImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Video</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={emailImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Email</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
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

        {dataDetails?.mobile != null && <Text style={styles.subTitle}>Mobile Phone Number</Text>}
        {dataDetails?.mobile != null && <Text style={styles.phoneAndEmail}>{dataDetails?.mobile}</Text>}

        {dataDetails?.homePhone != '' && <Text style={styles.subTitle}>Home Phone Number</Text>}
        {dataDetails?.homePhone != null && <Text style={styles.phoneAndEmail}>{dataDetails?.homePhone}</Text>}

        {dataDetails?.officePhone != '' && <Text style={styles.subTitle}>Office Phone Number</Text>}
        {dataDetails?.officePhone != null && <Text style={styles.phoneAndEmail}>{dataDetails?.officePhone}</Text>}

        {dataDetails?.email != '' && <Text style={styles.subTitle}>Email</Text>}
        {dataDetails?.email != null && <Text style={styles.phoneAndEmail}>{dataDetails?.email}</Text>}

        {dataDetails?.website != '' && <Text style={styles.subTitle}>Website</Text>}
        {dataDetails?.website != null && <Text style={styles.phoneAndEmail}>{dataDetails?.website}</Text>}

        {dataDetails?.address.street != '' && <Text style={styles.subTitle}>Location</Text>}
        {dataDetails?.address.street != '' && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street}
          </Text>
        )}
        {dataDetails?.address.street2 != '' && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.street2}
          </Text>
        )}
        {dataDetails?.address.city != '' && dataDetails?.address.state != '' && dataDetails?.address.zip != '' && (
          <Text style={lightOrDark == 'dark' ? styles.addressDark : styles.addressLight}>
            {dataDetails?.address.city + ', ' + dataDetails?.address.state + ' ' + dataDetails?.address.zip}
          </Text>
        )}

        <Text></Text>

        <TouchableOpacity onPress={() => HandleSectionTap(0)}>
          <Text style={styles.sectionText}>
            {showPersonal ? 'Hide Personal and Family' : 'Show Personal and Family'}
          </Text>
        </TouchableOpacity>
        {showPersonal && <Text style={styles.subTitle}>Birthday</Text>}
        {showPersonal && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.birthday}
          </Text>
        )}
        {showPersonal && <Text style={styles.subTitle}>Wedding Anniversary</Text>}
        {showPersonal && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.weddingAnniversary}
          </Text>
        )}
        {showPersonal && <Text style={styles.subTitle}>Children's Names</Text>}
        {showPersonal && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.childrensNames}
          </Text>
        )}
        {showPersonal && <Text style={styles.subTitle}>Notes</Text>}
        {showPersonal && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.personalAndFamily.personalNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => HandleSectionTap(1)}>
          <Text style={styles.sectionText}>{showActivity ? 'Hide Activity History' : 'Show Activity History'}</Text>
        </TouchableOpacity>
        {showActivity && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.historyNotes}</Text>
        )}
        <TouchableOpacity onPress={() => HandleSectionTap(2)}>
          <Text style={styles.sectionText}>
            {showToDos ? 'Hide To-Dos and Appointments' : 'Show To-Dos and Appointments'}
          </Text>
        </TouchableOpacity>
        {showToDos && dataToDos != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {FormatToDos(dataToDos[0].DateToUse, dataToDos[0].Title)}
          </Text>
        )}

        <TouchableOpacity onPress={() => HandleSectionTap(3)}>
          <Text style={styles.sectionText}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</Text>
        </TouchableOpacity>
        {showTransactions && dataDetails?.transactionNotes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.transactionNotes}
          </Text>
        )}

        <TouchableOpacity onPress={() => HandleSectionTap(4)}>
          <Text style={styles.sectionText}>{showGroups ? 'Hide Groups' : 'Show Groups'}</Text>
        </TouchableOpacity>
        {showGroups && dataDetails?.groupsNotes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.groupsNotes}</Text>
        )}

        <TouchableOpacity onPress={() => HandleSectionTap(5)}>
          <Text style={styles.sectionText}>
            {showInterests ? 'Hide Interests and Favorites' : 'Show Interests and Favorites'}
          </Text>
        </TouchableOpacity>
        {showInterests && dataDetails?.interestsAndFavorites.notes != null && (
          <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>
            {dataDetails?.interestsAndFavorites.notes}
          </Text>
        )}

        <TouchableOpacity onPress={() => HandleSectionTap(6)}>
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
        <TouchableOpacity onPress={DeletePressed}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.row}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={activityImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Activity
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={toDoImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              To-Do
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={transImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Transactn
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={apptImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>Appt</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
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
    height: '8%',
    backgroundColor: 'black',
    marginBottom: 5,
    paddingTop: 5,
  },
  rankRowLight: {
    height: '8%',
    backgroundColor: 'white',
    marginBottom: 5,
    paddingTop: 5,
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
    marginLeft: 20,
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
    marginLeft: 20,
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
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  topButtonTextLight: {
    height: 18,
    color: '#016497',
    textAlign: 'center',
  },
  bottomButtonTextDark: {
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  bottomButtonTextLight: {
    height: 18,
    width: 50,
    color: '#013273',
    textAlign: 'center',
  },
  namesDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 10,
  },
  namesLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 10,
  },
  addressDark: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 2,
  },
  addressLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 16,
    color: '#02ABF7',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 20,
  },
  deleteText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 20,
  },
});
