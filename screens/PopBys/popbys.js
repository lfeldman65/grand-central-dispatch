import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function PopByScreen() {
  let deviceWidth = Dimensions.get('window').width;

  const navigation = useNavigation();
  const [nearSelected, setNearSelected] = useState(true);
  const [prioritySelected, setPrioritySelected] = useState(false);
  const [savedSelected, setSavedSelected] = useState(false);

  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPressed();
    }, 2000);
  }, []);

  function nearPressed() {
    console.log('near pressed');
    setNearSelected(true);
    setPrioritySelected(false);
    setSavedSelected(false);
  }

  function priorityPressed() {
    console.log('priority pressed');
    setNearSelected(false);
    setPrioritySelected(true);
    setSavedSelected(false);
  }

  function savedPressed() {
    console.log('saved pressed');
    setNearSelected(false);
    setPrioritySelected(false);
    setSavedSelected(true);
  }

  function sanityCheck() {
    if (data == null) {
      return false;
    }

    if (data['data'] == null) {
      return false;
    }

    if (data['data'].length == 0) {
      return false;
    }
    return true;
  }

  function activityDisplay(index) {
    if (!sanityCheck()) return '';

    if (winTheDaySelected) {
      return data['data'][index]['achievedToday'];
    }
    return data['data'][index]['achievedThisWeek'];
  }

  function goalNumDisplay(index) {
    if (!sanityCheck()) return '';

    if (winTheDaySelected) {
      var weeklyTarget = data['data'][index]['goal']['weeklyTarget'];
      return Math.ceil(weeklyTarget / 5);
    }
    return data['data'][index]['goal']['weeklyTarget'];
  }

  function shouldDisplay(index) {
    if (!sanityCheck()) return false;

    return data['data'][index]['goal']['displayOnDashboard'];
  }

  function titleFor(index) {
    if (data == null) {
      return '';
    }
    if (data['data'] == null) {
      return '';
    }
    if (data['data'].length == 0) {
      return '';
    }
    var oldTitle = data['data'][index]['goal']['title'];
    if (oldTitle == 'Pop-By Made') {
      return 'Pop-Bys Delivered';
    }
    if (oldTitle == 'New Contacts') {
      return 'Database Additions';
    }
    if (oldTitle == 'Notes Made') {
      return 'Notes Written';
    }
    return oldTitle;
  }

  function fetchPressed() {
    console.log('Fetch Press');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('https://www.referralmaker.com/services/mobileapi/priorityActions?type=call', requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        console.log(result);
        setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          //  navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  ) : (
    <>
      <View style={styles.container}>
        {/* <View style={styles.tabButtonRow}>
          <Text style={nearSelected == true ? styles.selected : styles.unselected} onPress={nearPressed}>
            Near Me
          </Text>
          <Text style={prioritySelected == true ? styles.selected : styles.unselected} onPress={priorityPressed}>
            Priority
          </Text>
          <Text style={savedSelected == true ? styles.selected : styles.unselected} onPress={savedPressed}>
            Saved
          </Text>
        </View> */}
      </View>

      {/* <View style={styles.bottom}></View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: 'black',
  },
  bottom: {
    flex: 1,
    backgroundColor: 'red',
    height: 100,
  },
  hack: {
    height: 100,
    backgroundColor: 'white',
  },
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 10,
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
  },
  goalTitle: {
    paddingRight: 30,
    color: '#1A6295',
    fontSize: 18,
    textAlign: 'right',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  goalName: {
    width: 200,
    color: '#1A6295',
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
  },
  goalNum: {
    width: 20,
    height: 32,
    color: 'black',
    fontSize: 18,
    textAlign: 'right',
    marginRight: 20,
  },
  grayRectangle: {
    height: 25,
    width: '75%',
    backgroundColor: 'lightgray',
    marginRight: 10,
    borderRadius: 5,
  },
  trophy: {
    width: 35,
    height: 35,
    paddingBottom: 10,
  },
  trackText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
