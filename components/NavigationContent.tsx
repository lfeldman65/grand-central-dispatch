import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Collapsible from 'react-native-collapsible';
import { Analytics, PageHit, Event } from 'expo-analytics';

// Hamburger Menu test
//import rmLogo from '../images/logoWide.png';
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
import { analytics } from '../utils/analytics';

function CustomDrawerContent(props) {
  const { navigation } = props;
  const [expanded, setExpanded] = useState({
    relationships: false,
    transactions: false,
  });

  const handleMenuExpand = (type) => {
    if (type === 'relationships') {
      setExpanded({ ...expanded, relationships: !expanded.relationships });
    }
    if (type === 'transactions') {
      setExpanded({ ...expanded, transactions: !expanded.transactions });
    }
  };

  const trackPressed = (screenName) => {
    console.log(screenName);

    analytics
      .event(new Event('Menu Item Pressed', screenName, '0'))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));
  };

  //****** there are 2 ways to create a function
  //pressed and pressed2
  const pressed = (screenName) => {
    navigation.navigate(screenName);
    trackPressed(screenName);
    //console.log('111');
  };

  function pressed2(screenName) {
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

        <TouchableOpacity onPress={() => pressed('Goals')}>
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
        <TouchableWithoutFeedback onPress={() => handleMenuExpand('relationships')}>
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
          <TouchableOpacity onPress={() => pressed('manageRelationships')}>
            <View style={styles.menuItem}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Manage Relationships</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pressed('recentcontactactivity')}>
            <View style={styles.menuItem}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Recent Contact Activity</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pressed('videoHistory')}>
            <View style={styles.menuItem}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Video History</Text>
            </View>
          </TouchableOpacity>
        </Collapsible>
        <TouchableWithoutFeedback onPress={() => handleMenuExpand('transactions')}>
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
          <TouchableOpacity onPress={() => pressed('realEstateTransactions')}>
            <View style={styles.menuItem}>
              <Image source={transIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Real Estate Transactions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pressed('LenderTransactionsScreen')}>
            <View style={styles.menuItem}>
              <Image source={transIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Lender Transactions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pressed('otherTransactions')}>
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
        <TouchableOpacity onPress={() => pressed('SettingsScreen')}>
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
