import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import { getRelDetails } from './api';
import { RelDetailsProps } from './interfaces';
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
    fetchRelDetails();
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

  //console.log(dataDetails)
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
        <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{contactId}</Text>

        <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.ranking}</Text>
        <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.mobile}</Text>
        <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.homePhone}</Text>
        <Text style={lightOrDark == 'dark' ? styles.namesDark : styles.namesLight}>{dataDetails?.officePhone}</Text>

        <TouchableOpacity onPress={() => HandleSectionTap(0)}>
          <Text style={styles.sectionText}>
            {showPersonal ? 'Hide Personal and Family' : 'Show Personal and Family'}
          </Text>
        </TouchableOpacity>
        {showPersonal && <Text style={styles.subTitle}>Birthday</Text>}
        {showPersonal && <Text style={styles.subTitle}>Wedding Anniversary</Text>}
        {showPersonal && <Text style={styles.subTitle}>Children's Names</Text>}
        {showPersonal && <Text style={styles.subTitle}>Notes</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(1)}>
          <Text style={styles.sectionText}>{showActivity ? 'Hide Activity History' : 'Show Activity History'}</Text>
        </TouchableOpacity>
        {showActivity && <Text style={styles.subTitle}>Activity Here</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(2)}>
          <Text style={styles.sectionText}>
            {showToDos ? 'Hide To-Dos and Appointments' : 'Show To-Dos and Appointments'}
          </Text>
        </TouchableOpacity>
        {showToDos && <Text style={styles.subTitle}>Activity Here</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(3)}>
          <Text style={styles.sectionText}>{showTransactions ? 'Hide Transactions' : 'Show Transactions'}</Text>
        </TouchableOpacity>
        {showTransactions && <Text style={styles.subTitle}>Transactions Here</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(4)}>
          <Text style={styles.sectionText}>{showGroups ? 'Hide Groups' : 'Show Groups'}</Text>
        </TouchableOpacity>
        {showGroups && <Text style={styles.subTitle}>Groups Here</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(5)}>
          <Text style={styles.sectionText}>
            {showInterests ? 'Hide Interests and Favorites' : 'Show Interests and Favorites'}
          </Text>
        </TouchableOpacity>
        {showInterests && <Text style={styles.subTitle}>Interests Here</Text>}

        <TouchableOpacity onPress={() => HandleSectionTap(6)}>
          <Text style={styles.sectionText}>{showBiz ? 'Hide Business and Career' : 'Show Business and Career'}</Text>
        </TouchableOpacity>
        {showBiz && <Text style={styles.subTitle}>Biz Here</Text>}
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

      {/* <Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>
        {dataDetails[0].firstName}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignContent: 'center',
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
  },
  namesLight: {
    color: 'black',
    textAlign: 'left',
    marginLeft: 20,
  },
  sectionText: {
    fontSize: 16,
    color: '#02ABF7',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 10,
  },
});
