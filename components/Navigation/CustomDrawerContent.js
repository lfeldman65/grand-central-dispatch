import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Collapsible from 'react-native-collapsible';

// Hamburger Menu
import rmLogo from '../../assets/logoWide.png';
import dashIcon from '../../assets/menuDashboard.png';
import goalsIcon from '../../assets/menuGoals.png';
import pacIcon from '../../assets/menuPAC.png';
import relIcon from '../../assets/menuRel.png';
import transIcon from '../../assets/menuTransactions.png';
import popIcon from '../../assets/menuPopBys.png';
import todoIcon from '../../assets/menuToDo.png';
import calendarIcon from '../../assets/menuCalendar.png';
import podcastIcon from '../../assets/menuPodcasts.png';
import settingsIcon from '../../assets/menuSettings.png';

import chevron from '../../assets/chevron_white.png';


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

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <View style={{ display: 'flex', color: 'white' }}>
        <View style={styles.menuImageContainer}>
          <Image source={rmLogo} style={styles.menuImage} />
        </View>
        
        {/* navigation.navigate(name), name must match exactly with name in Navigation.js */}
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}> 
          <View style={styles.menuItem}>
            <Image source={dashIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
          <View style={styles.menuItem}>
            <Image source={goalsIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Goals</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PAC')}>
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
          <TouchableOpacity onPress={() => navigation.navigate('managerelationships')}>
            <View style={[styles.menuItem, expanded && styles.visible]}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Manage Relationships</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('recentcontactactivity')}>
            <View style={[styles.menuItem, expanded && styles.visible]}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Recent Contact Activity</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PAC')}>
            <View style={[styles.menuItem, expanded && styles.visible]}>
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
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <View style={[styles.menuItem, expanded && styles.visible]}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Real Estate Transactions</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PAC')}>
            <View style={[styles.menuItem, expanded && styles.visible]}>
              <Image source={relIcon} style={[styles.menuIcon, styles.hidden]} />
              <Text style={styles.menuItemText}>Other Transactions</Text>
            </View>
          </TouchableOpacity>
        </Collapsible>
        <TouchableOpacity onPress={() => navigation.navigate('Pop-Bys')}>
          <View style={styles.menuItem}>
            <Image source={popIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Pop-By</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('To-Do')}>
          <View style={styles.menuItem}>
            <Image source={todoIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>To Do</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
          <View style={styles.menuItem}>
            <Image source={calendarIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Calendar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Podcasts')}>
          <View style={styles.menuItem}>
            <Image source={podcastIcon} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Podcasts</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
    opacity: .75
  },
});
