import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

// Hamburger Menu
import hamburgerIcon from '../../assets/logoWide.png';
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

function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <View style={{ display: 'flex', color: 'white' }}>
        <View style={styles.menuImageContainer}>
          <Image source={hamburgerIcon} style={styles.menuImage} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <View style={styles.menuItem}>
            <Image source={dashIcon} style={styles.menuIcon} />
            <Text style={{ color: 'white' }}>Dashboard</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.menuItem}>
          <Image source={goalsIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Goals</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={pacIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Priority Action Center</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={relIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Relationships</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={transIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Transactions</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={popIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Pop-By</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={todoIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>To Do</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={calendarIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Calendar</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={podcastIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Podcasts</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={settingsIcon} style={styles.menuIcon} />
          <Text style={{ color: 'white' }}>Settings</Text>
        </View>
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
    padding: 15,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  menuImageContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    margin: 20,
  },
  menuImage: {
    height: 50,
    width: 200,
  },
});
