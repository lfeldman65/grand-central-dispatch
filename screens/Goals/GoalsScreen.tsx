import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { GoalDataProps, GoalObject } from './interfaces';
import { getGoalData, trackAction } from './api';
import TrackActivity from './TrackActivityScreen';
import globalStyles from '../../globalStyles';
import AddRelScreen from '../Relationships/AddRelationshipScreen';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics, isNullOrEmpty } from '../../utils/general';
import { testForNotificationTrack } from './handleWinNotifications';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';
import { titleFor } from './goalHelpers';

const dayTrophy = require('../Goals/images/dailyTrophy.png');
const weekTrophy = require('../Goals/images/weeklyTrophy.png');
const noTrophy = require('../Goals/images/noTrophy.png');
const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

var goalIDForReferralType = '0'; // given or received
var barColor = '';

export default function GoalsScreen() {
  const navigation = useNavigation<any>();
  const [winTheDaySelected, setWinTheDaySelected] = useState(true);
  const [goalList, setGoalList] = useState<GoalDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [addRelModalVisible, setAddRelModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  }

  function trackActivityPressed() {
    ga4Analytics('Goals_Track_Activity', {
      contentType: 'none',
      itemId: 'id0303',
    });
    setTrackModalVisible(true);
  }

  function winTheDayPressed() {
    ga4Analytics('Goals_Win_Day_Tab', {
      contentType: 'none',
      itemId: 'id0301',
    });
    setWinTheDaySelected(true);
    fetchGoals(true, false);
  }

  function winTheWeekPressed() {
    ga4Analytics('Goals_Win_Week_Tab', {
      contentType: 'none',
      itemId: 'id0302',
    });
    setWinTheDaySelected(false);
    fetchGoals(true, false);
  }

  function styleForProgress(goalData: GoalDataProps) {
    var barColor = '#1398f5';
    let deviceWidth = Dimensions.get('window').width;
    console.log('width: ' + deviceWidth);
    var barWidthNum = 0.71 * deviceWidth * barPercentage(goalData);
    console.log('barwidth:' + barWidthNum);
    if (winTheDaySelected) {
      barColor = '#55bf43';
    }
    return {
      height: 25,
      width: barWidthNum,
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
      width: 225,
      color: textColor,
      fontSize: 15,
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

  const handleLinkPress = (index: number) => {
    switch (index) {
      case 0:
        ga4Analytics('Goals_Calls_Link', {
          contentType: 'none',
          itemId: 'id0304',
        });
        navigation.popToTop();
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'calls' },
        });
        break;
      case 1:
        ga4Analytics('Goals_Notes_Link', {
          contentType: 'none',
          itemId: 'id0305',
        });
        navigation.popToTop();
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'notes' },
        });
        break;
      case 2:
        ga4Analytics('Goals_Pop_Bys_Link', {
          contentType: 'none',
          itemId: 'id0306',
        });
        navigation.popToTop();
        navigation.navigate('PAC', {
          screen: 'PAC1',
          params: { defaultTab: 'popby' },
        });
        break;
      case 3:
        ga4Analytics('Goals_Database_Link', {
          contentType: 'none',
          itemId: 'id0307',
        });
        databaseAdditions();
        break;
    }
  };

  function databaseAdditions() {
    console.log('DATABASE ADDITIONS');
    setAddRelModalVisible(true);
  }

  function fetchGoals(isMounted: boolean, afterTrack: boolean) {
    setIsLoading(true);
    getGoalData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setGoalList(res.data);
          //  console.log(res.data);
          if (afterTrack) {
            console.log('goalid track: ' + goalIDForReferralType);
            notifyIfWin(goalIDForReferralType, res.data);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function notifyIfWin(goalId: string, data: GoalDataProps[]) {
    console.log('GOALID: ' + goalId);
    var i = 0;
    while (i < data.length) {
      if (data[i].goal.id.toString() == goalId) {
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

  function saveAddRelComplete() {
    console.log('SAVEADDRELCOMPLETE');
    fetchGoals(true, false);
  }

  function saveTrackComplete(
    guid: string,
    contactGUID: string,
    userGaveReferral: boolean,
    followUp: boolean,
    goalId: string,
    subject: string,
    date: string,
    askedRef: boolean,
    note: string,
    referralInPast: boolean,
    flag: string
  ) {
    setIsLoading(true);
    goalIDForReferralType = flag;
    console.log('goalIDForReferralType: ' + goalIDForReferralType);
    console.log('flag: ' + flag);
    console.log('userGave: ' + userGaveReferral);

    trackActivityAPI(
      guid,
      goalId,
      contactGUID,
      userGaveReferral,
      followUp,
      subject,
      date,
      askedRef,
      note,
      referralInPast,
      trackSuccess,
      trackFailure
    );
  }

  function trackActivityAPI(
    contactId: string,
    goalId: string,
    contactGUID: string,
    userGaveReferral: boolean,
    followUp: boolean,
    subject: string,
    date: string,
    referral: boolean,
    note: string,
    referralInPast: boolean,
    onSuccess: any,
    onFailure: any
  ) {
    trackAction(
      contactId,
      goalId,
      contactGUID,
      userGaveReferral,
      followUp,
      subject,
      date,
      referral,
      note,
      referralInPast
    )
      .then((res) => {
        //  console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
          onFailure();
        } else {
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure();
        console.log('complete error' + error);
      });
  }

  function trackSuccess() {
    setIsLoading(false);
    fetchGoals(true, true);
    console.log('TRACKSUCCESS');
  }

  function trackFailure() {
    setIsLoading(false);
    console.log('track failure');
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, goalList]);

  useEffect(() => {
    let isMounted = true;
    fetchGoals(isMounted, false);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  if (isLoading) {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
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

          <Text style={lightOrDark == 'dark' ? styles.goalTitleDark : styles.goalTitleLight}>Goal</Text>

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

          <TouchableOpacity style={styles.bottomContainer} onPress={() => trackActivityPressed()}>
            <View style={styles.trackActivityButton}>
              <Text style={styles.buttonText}>Track Activity</Text>
            </View>
          </TouchableOpacity>
          {trackModalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={trackModalVisible}
              onRequestClose={() => {
                setTrackModalVisible(!trackModalVisible);
              }}
            >
              <TrackActivity
                lightOrDark={lightOrDark}
                title="Track Activity"
                onSave={saveTrackComplete}
                setModalVisible={setTrackModalVisible}
              />
            </Modal>
          )}
          {addRelModalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={addRelModalVisible}
              onRequestClose={() => {
                setAddRelModalVisible(!addRelModalVisible);
              }}
            >
              <AddRelScreen
                title={'New Relationship'}
                onSave={saveAddRelComplete}
                setModalVisible={setAddRelModalVisible}
                lightOrDark={lightOrDark}
              />
            </Modal>
          )}
        </View>
        {quickSearchVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={quickSearchVisible}
            onRequestClose={() => {
              setQuickSearchVisible(!quickSearchVisible);
            }}
          >
            <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
          </Modal>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  hackDark: {
    height: 100,
    backgroundColor: 'black',
  },
  hackLight: {
    height: 100,
    backgroundColor: 'white',
  },
  goalTitleDark: {
    paddingRight: 30,
    color: 'white',
    fontSize: 16,
    textAlign: 'right',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitleLight: {
    paddingRight: 30,
    color: 'black',
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
    height: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'right',
    marginRight: 20,
  },
  goalTargetLight: {
    width: 20,
    height: 20,
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
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
  },
  trackActivityButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginBottom: 12,
  },
});
