import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Collapsible from 'react-native-collapsible';
import { storage } from '../utils/storage';
import * as Analytics from 'expo-firebase-analytics';

// Hamburger Menu test
const rmLogo = require('../images/logoWide.png');

const dashIcon = require('../images/menuDashboard.png');
const goalsIcon = require('../images/menuGoals.png');
const pacIcon = require('../images/menuPAC.png');
const relIcon = require('../images/menuRel.png');
const transIcon = require('../images/menuTransactions.png');
const popIcon = require('../images/menuPopBys.png');
const todoIcon = require('../images/menuToDo.png');
const calendarIcon = require('../images/menuCalendar.png');
const podcastIcon = require('../images/menuPodcasts.png');
const settingsIcon = require('../images/menuSettings.png');
const chevron = require('../images/chevron_white.png');

function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const [expanded, setExpanded] = useState({
    relationships: false,
    transactions: false,
  });
  const [hasBombBomb, setHasBombBomb] = useState(false);
  const [businessType, setBusinessType] = useState('unknown');

  async function handleRelMenuExpand() {
    var hasBombBombString = await storage.getItem('hasBombBomb');
    if (hasBombBombString == 'true') {
      setHasBombBomb(true);
    } else {
      setHasBombBomb(false);
    }
    setExpanded({ ...expanded, relationships: !expanded.relationships });
  }

  async function handleTxMenuExpand() {
    var bizType = await storage.getItem('businessType');
    console.log('BIZTYPE:' + bizType);
    if (bizType == null) {
      setBusinessType('realtorAndLender');
    } else {
      setBusinessType(bizType);
    }
    setExpanded({ ...expanded, transactions: !expanded.transactions });
  }

  function getPrettyEvent(screen: string) {
    if (screen == 'Dashboard') return 'Hamburger_Menu_Dashboard';
    if (screen == 'goals') return 'Hamburger_Menu_Goals';
    if (screen == 'PAC') return 'Hamburger_Menu_PAC';
    if (screen == 'Rolodex') return 'Hamburger_Menu_Manage_Relationships';
    if (screen == 'RecentActivity') return 'Hamburger_Menu_Recent_Activity';
    if (screen == 'VideoStack') return 'Hamburger_Menu_Video_History';
    if (screen == 'RETransactionsMenu') return 'Hamburger_Menu_Realtor_Transactions';
    if (screen == 'LenderTransactionsMenu') return 'Hamburger_Menu_Lender_Transactions';
    if (screen == 'OtherTransactionsMenu') return 'Hamburger_Menu_Lender_Transactions';
    if (screen == 'PopBysScreen') return 'Hamburger_Menu_Pop_By';
    if (screen == 'To-Do') return 'Hamburger_Menu_To_Do';
    if (screen == 'CalendarScreen') return 'Hamburger_Menu_Calendar';
    if (screen == 'PodcastsScreen') return 'Hamburger_Menu_Podcasts';
    if (screen == 'SettingsScreenNav') return 'Hamburger_Menu_Settings';
    return 'Other';
  }

  function getItemID(screen: string) {
    if (screen == 'Dashboard') return 'id0100';
    if (screen == 'goals') return 'id0101';
    if (screen == 'PAC') return 'id0102';
    if (screen == 'Rolodex') return 'id0103';
    if (screen == 'RecentActivity') return 'id0104';
    if (screen == 'VideoStack') return 'id0105';
    if (screen == 'RETransactionsMenu') return 'id0106';
    if (screen == 'LenderTransactionsMenu') return 'id0107';
    if (screen == 'OtherTransactionsMenu') return 'id0108';
    if (screen == 'PopBysScreen') return 'id0109';
    if (screen == 'To-Do') return 'id0110';
    if (screen == 'CalendarScreen') return 'id0111';
    if (screen == 'PodcastsScreen') return 'id0112';
    if (screen == 'SettingsScreenNav') return 'id0113';
    return 'id9999';
  }

  const trackPressed = (screenName: string) => {
    console.log('SCREEN: ' + screenName);
    Analytics.logEvent(getPrettyEvent(screenName), {
      contentType: 'none',
      itemId: getItemID(screenName),
    });
  };

  //****** there are 2 ways to create a function
  //pressed and pressed2
  const pressed = (screenName: string) => {
    navigation.navigate(screenName);
    trackPressed(screenName);
    //console.log('111');
  };

  function pressed2(screenName: string) {
    console.log('p2');
    navigation.navigate(screenName);
    trackPressed(screenName);
  }

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <View style={{ display: 'flex' }}>
        <View style={styles.menuImageContainer}>
          <Image source={rmLogo} style={styles.menuImage} />
        </View>

        {/* navigation.navigate(name), name must match exactly with name in Navigation.js */}
        <TouchableOpacity onPress={() => pressed('Dashboard')}>
          <View style={styles.menuItem}>
            <Image source={dashIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pressed('goals')}>
          <View style={styles.menuItem}>
            <Image source={goalsIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Goals</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressed('PAC')}>
          <View style={styles.menuItem}>
            <Image source={pacIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Priority Action Center</Text>
          </View>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => handleRelMenuExpand()}>
          <View style={styles.menuItem}>
            <Image source={relIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Relationships</Text>
            <Image
              source={chevron}
              style={[
                styles.menuIcon,
                styles.chevron,
                expanded.relationships && { transform: [{ rotateX: '-180deg' }] },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <Collapsible collapsed={!expanded.relationships}>
          <TouchableOpacity onPress={() => pressed('Rolodex')}>
            <View style={styles.menuItem}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Manage Relationships</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pressed('RecentActivity')}>
            <View style={styles.menuItem}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Recent Contact Activity</Text>
            </View>
          </TouchableOpacity>
          {hasBombBomb && (
            <TouchableOpacity onPress={() => pressed('VideoStack')}>
              <View style={styles.menuItem}>
                <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
                <Text style={styles.menuItemText}>Video History</Text>
              </View>
            </TouchableOpacity>
          )}
        </Collapsible>
        <TouchableWithoutFeedback onPress={() => handleTxMenuExpand()}>
          <View style={styles.menuItem}>
            <Image source={transIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Transactions</Text>
            <Image
              source={chevron}
              style={[
                styles.menuIcon,
                styles.chevron,
                expanded.transactions && { transform: [{ rotateX: '-180deg' }] },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <Collapsible collapsed={!expanded.transactions}>
          {(businessType.includes('realtor') || businessType.includes('Realtor')) && (
            <TouchableOpacity onPress={() => pressed('RETransactionsMenu')}>
              <View style={styles.menuItem}>
                <Image source={transIcon} style={[styles.menuIcon, styles.hidden]} />
                <Text style={styles.menuItemText}>Real Estate Transactions</Text>
              </View>
            </TouchableOpacity>
          )}
          {(businessType.includes('Lender') || businessType.includes('lender')) && (
            <TouchableOpacity onPress={() => pressed('LenderTransactionsMenu')}>
              <View style={styles.menuItem}>
                <Image source={transIcon} style={[styles.menuIcon, styles.hidden]} />
                <Text style={styles.menuItemText}>Lender Transactions</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => pressed('OtherTransactionsMenu')}>
            <View style={styles.menuItem}>
              <Image source={transIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Other Transactions</Text>
            </View>
          </TouchableOpacity>
        </Collapsible>
        <TouchableOpacity onPress={() => pressed('PopBysScreen')}>
          <View style={styles.menuItem}>
            <Image source={popIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Pop-By</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressed('To-Do')}>
          <View style={styles.menuItem}>
            <Image source={todoIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>To Do</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressed('CalendarScreen')}>
          <View style={styles.menuItem}>
            <Image source={calendarIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Calendar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressed('PodcastsScreen')}>
          <View style={styles.menuItem}>
            <Image source={podcastIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Podcasts</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressed('SettingsScreenNav')}>
          <View style={styles.menuItem}>
            <Image source={settingsIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
  },
  menuItemText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuIcon: {
    width: 24,
    marginRight: 20,
    height: 24,
    resizeMode: 'contain',
  },
  menuImageContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    margin: 20,
  },
  menuImage: {
    height: 30,
    width: 200,
  },
  hidden: {
    opacity: 0,
  },
  chevron: {
    position: 'absolute',
    top: '65%',
    right: 0,
    width: 15,
    height: 15,
    opacity: 0.75,
  },
});
