import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import { isNullOrEmpty } from '../../utils/general';
import { GoalDataProps, GoalObject } from './interfaces';
import { getGoalData } from './api';
import { storage } from '../../utils/storage';

const dayTrophy = require('../Goals/images/dailyTrophy.png');
const weekTrophy = require('../Goals/images/weeklyTrophy.png');
const noTrophy = require('../Goals/images/noTrophy.png');

import globalStyles from '../../globalStyles';

export default function GoalsScreen() {
  const navigation = useNavigation<any>();
  const [winTheDaySelected, setWinTheDaySelected] = useState(true);
  const [goalList, setGoalList] = useState<GoalDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  function winTheDayPressed() {
    analytics.event(new Event('Goals', 'Win the Day Pressed'));
    setWinTheDaySelected(true);
  }

  function winTheWeekPressed() {
    analytics.event(new Event('Goals', 'Win the Week Pressed'));
    setWinTheDaySelected(false);
  }

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  function styleForProgress(goalData: GoalDataProps) {
    var barColor = '#1398f5';
    var barWidth = 75 * barPercentage(goalData) + '%';
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
      textColor = '#1398f5'; // link blue
    } else {
      if (lightOrDark == 'dark') {
        textColor = 'white';
      }
    }
    return {
      width: 200,
      color: textColor,
      fontSize: 16,
      marginLeft: 10,
    };
  }

  function activityCount(goalData: GoalDataProps) {
    if (isNullOrEmpty(goalData.goal)) {
      return 0;
    }
    if (winTheDaySelected) {
      return goalData.achievedToday;
    }
    return goalData.achievedThisWeek;
  }

  function barPercentage(goalData: GoalDataProps) {
    if (isNullOrEmpty(goalData)) return 0;

    var dailyTarget = Math.ceil(goalData.goal.weeklyTarget / 5);

    if (winTheDaySelected) {
      var dailyNum = goalData.achievedToday;
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
    var weeklyNum = goalData.achievedThisWeek;
    if (goalData.goal.weeklyTarget == 0 && weeklyNum > 0) {
      return 1.0;
    }
    if (goalData.goal.weeklyTarget == 0 && weeklyNum == 0) {
      return 0.0;
    }
    if (weeklyNum > goalData.goal.weeklyTarget) {
      return 1.0;
    }
    return weeklyNum / goalData.goal.weeklyTarget;
  }

  function goalTargetDisplay(goal: GoalObject) {
    if (goal == null) {
      return 0;
    }
    if (winTheDaySelected) {
      var weeklyTarget = goal.weeklyTarget;
      return Math.ceil(weeklyTarget / 5);
    }
    return goal.weeklyTarget;
  }

  function shouldDisplayGoal(goal: GoalObject) {
    if (goal == null) return false;
    else return goal.displayOnDashboard;
  }

  function titleFor(goal: GoalObject) {
    if (isNullOrEmpty(goal)) {
      return ' ';
    }
    var oldTitle = goal.title;
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
    //console.log('here ' + index.toString());

    switch (index) {
      case 0:
        analytics.event(new Event('Goals', 'Calls Pressed'));
        navigation.popToTop();
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
        break;
      case 1:
        analytics.event(new Event('Goals', 'Notes Pressed'));
        navigation.popToTop();
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'notes' },
        });
        break;
      case 2:
        analytics.event(new Event('Goals', 'Pop-Bys Pressed'));
        navigation.popToTop();
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

  function fetchGoals() {
    setIsLoading(true);
    getGoalData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setGoalList(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    fetchGoals();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#AAA" />
      </View>
    );
  } else {
    return (
      <View style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
        <View style={globalStyles.tabButtonRow}>
          <Text
            style={winTheDaySelected == true ? globalStyles.selected : globalStyles.unselected}
            onPress={winTheDayPressed}
          >
            Win the Day
          </Text>
          <Text
            style={winTheDaySelected == false ? globalStyles.selected : globalStyles.unselected}
            onPress={winTheWeekPressed}
          >
            Win the Week
          </Text>
        </View>

        <Text style={styles.goalTitle}>Goal</Text>

        <ScrollView>
          {goalList.map(
            (item, index) =>
              shouldDisplayGoal(item.goal) && (
                <View key={index}>
                  <TouchableOpacity onPress={() => handleLinkPress(index)}>
                    <Text style={styleForGoalTitle(index)}>
                      {titleFor(item.goal)} ({activityCount(item)})
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.progress}>
                    <View style={styles.grayRectangle}></View>
                    <Image
                      source={
                        barPercentage(item) >= 1.0 ? (winTheDaySelected == true ? dayTrophy : weekTrophy) : noTrophy
                      }
                      style={styles.trophy}
                    />
                    <Text style={lightOrDark == 'dark' ? styles.goalTargetDark : styles.goalTargetLight}>
                      {goalTargetDisplay(item.goal)}
                    </Text>
                  </View>
                  <View style={styles.progress}>
                    <View style={styleForProgress(item)}></View>
                  </View>
                </View>
              )
          )}
          <View style={lightOrDark == 'dark' ? styles.hackDark : styles.hackLight}></View>
        </ScrollView>

        {/* {<TouchableOpacity onPress={fetchGoals}>
        <Text style={styles.trackText}>Track Activity</Text>
      </TouchableOpacity> } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: 'black',
  },
  containerLight: {
    backgroundColor: 'white',
  },
  hackDark: {
    height: 100,
    backgroundColor: 'black',
  },
  hackLight: {
    height: 100,
    backgroundColor: 'white',
  },
  goalTitle: {
    paddingRight: 30,
    color: '#1398f5',
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
  goalTargetDark: {
    width: 20,
    height: 32,
    color: 'white',
    fontSize: 16,
    textAlign: 'right',
    marginRight: 20,
  },
  goalTargetLight: {
    width: 20,
    height: 32,
    color: 'black',
    fontSize: 16,
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
