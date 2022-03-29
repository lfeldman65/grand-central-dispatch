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
import MenuIcon from '../../components/MenuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const dayTrophy = require('../Goals/images/dailyTrophy.png');
const weekTrophy = require('../Goals/images/weeklyTrophy.png');
const noTrophy = require('../Goals/images/noTrophy.png');

import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';

//import globalStyles from '../../utils/globalStyles';

export default function GoalsScreen() {
  const navigation = useNavigation();
  const [winTheDaySelected, setWinTheDaySelected] = useState(true);
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

  function winTheDayPressed() {
    console.log('win the day pressed');
    analytics.event(new Event('Goals', 'Win the Day Pressed'));
    setWinTheDaySelected(true);
  }

  function winTheWeekPressed() {
    console.log('win the week pressed');
    analytics.event(new Event('Goals', 'Win the Week Pressed'));
    setWinTheDaySelected(false);
  }

  function styleForProgress(index: number) {
    var barColor = '#1398f5';

    var barWidth = 75 * barPercentage(index) + '%';
    if (winTheDaySelected) {
      barColor = '#55bf43';
    }
    return {
      height: 25,
      width: barWidth,
      backgroundColor: barColor,
      marginRight: 10,
      borderRadius: 5,
      marginTop: -55,
    };
  }

  function styleForGoalTitle(index: number) {
    var textColor = 'black';
    if (index < 4) {
      textColor = '#1C6597';
    }
    return {
      width: 200,
      color: textColor,
      fontSize: 16,
      marginLeft: 10,
    };
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

  function activityCount(index: number) {
    if (!sanityCheck()) return '';

    if (winTheDaySelected) {
      return data['data'][index]['achievedToday'];
    }
    return data['data'][index]['achievedThisWeek'];
  }

  function barPercentage(index: number) {
    if (!sanityCheck()) return 0;

    var weeklyTarget = data['data'][index]['goal']['weeklyTarget'];
    var dailyTarget = Math.ceil(weeklyTarget / 5);

    if (winTheDaySelected) {
      var dailyNum = data['data'][index]['achievedToday'];
      if (dailyTarget == 0 && dailyNum > 0) {
        return 1.0;
      }
      if (dailyTarget == 0 && dailyNum == 0) {
        return 0.0;
      }
      if (dailyNum > dailyTarget) {
        return 1.0;
      }
      return dailyNum / dailyTarget;
    }
    var weeklyNum = data['data'][index]['achievedThisWeek'];
    if (weeklyTarget == 0 && weeklyNum > 0) {
      return 1.0;
    }
    if (weeklyTarget == 0 && weeklyNum == 0) {
      return 0.0;
    }
    if (weeklyNum > weeklyTarget) {
      return 1.0;
    }
    return weeklyNum / weeklyTarget;
  }

  function goalTargetDisplay(index: number) {
    if (!sanityCheck()) return '';

    if (winTheDaySelected) {
      var weeklyTarget = data['data'][index]['goal']['weeklyTarget'];
      return Math.ceil(weeklyTarget / 5);
    }
    return data['data'][index]['goal']['weeklyTarget'];
  }

  function shouldDisplay(index: number) {
    if (!sanityCheck()) return false;

    return data['data'][index]['goal']['displayOnDashboard'];
  }

  function titleFor(index: number) {
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

  const handleLinkPress = (index: number) => {
    console.log('here ' + index.toString());
    if (!sanityCheck()) return false;

    switch (index) {
      case 0:
        analytics.event(new Event('Goals', 'Calls Pressed'));
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
        break;
      case 1:
        analytics.event(new Event('Goals', 'Notes Pressed'));
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'notes' },
        });
        break;
      case 2:
        analytics.event(new Event('Goals', 'Pop-Bys Pressed'));
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'popby' },
        });
        break;
      case 3:
        analytics.event(new Event('Goals', 'Database Additions Pressed'));
        //  navigation.navigate('Pop-Bys');  // Add new relationship
        break;
    }
  };

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

    fetch('https://www.referralmaker.com/services/mobileapi/activityGoalsWins', requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        console.log(result);
        setData(result);
        if (result.status == 'error') {
          console.error(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          //  navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.tabButtonRow}>
        <Text style={winTheDaySelected == true ? styles.selected : styles.unselected} onPress={winTheDayPressed}>
          Win the Day
        </Text>
        <Text style={winTheDaySelected == false ? styles.selected : styles.unselected} onPress={winTheWeekPressed}>
          Win the Week
        </Text>
      </View>

      <Text style={styles.goalTitle}>Goal</Text>

      <ScrollView>
        {data['data'].map((name, index) =>
          shouldDisplay(index) ? (
            <View key={index}>
              <TouchableOpacity onPress={() => handleLinkPress(index)}>
                <Text style={styleForGoalTitle(index)}>
                  {titleFor(index)} ({activityCount(index)})
                </Text>
              </TouchableOpacity>

              <View style={styles.progress}>
                <View style={styles.grayRectangle}></View>
                <Image
                  source={barPercentage(index) >= 1.0 ? (winTheDaySelected == true ? dayTrophy : weekTrophy) : noTrophy}
                  style={styles.trophy}
                />
                <Text style={styles.goalTarget}>{goalTargetDisplay(index)}</Text>
              </View>
              <View style={styles.progress}>
                <View style={styleForProgress(index)}></View>
              </View>
            </View>
          ) : (
            <View></View>
          )
        )}
        <View style={styles.hack}></View>
      </ScrollView>

      {/* {<TouchableOpacity onPress={fetchPressed}>
        <Text style={styles.trackText}>Track Activity</Text>
      </TouchableOpacity> } */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
    color: '#1C6597',
    fontSize: 16,
    textAlign: 'right',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  goalTarget: {
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
