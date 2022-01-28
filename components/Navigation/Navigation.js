import { StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

// Sections

import LoginScreen from '../../screens/login.js';
import DashboardScreen from '../../screens/Dashboard/dashboard.js';
import GoalsScreen from '../../screens/Goals/goals';
import PACScreen from '../../screens/PAC/pac';
import RelationshipsScreen from '../../screens/Relationships/relationships.js';
import TransactionsScreen from '../../screens/Transactions/transactions';
import PopBysScreen from '../../screens/PopBys/popbys';
import ToDoScreen from '../../screens/ToDo/todos';
import CalendarScreen from '../../screens/Calendar/calendar';
import PodcastScreen from '../../screens/Podcasts/podcasts';
import SettingsScreen from '../../screens/Settings/appsettings.js';

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

// Components
import CustomDrawerContent from './CustomDrawerContent.js';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export const GoalsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Goals" component={GoalsScreen} />
    </Stack.Navigator>
  );
};

export const PACStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PAC" component={PACScreen} />
    </Stack.Navigator>
  );
};

export const RelationshipsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Relationships" component={RelationshipsScreen} />
    </Stack.Navigator>
  );
};

export const TransactionsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

export const PopByStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pop-Bys" component={PopBysScreen} />
    </Stack.Navigator>
  );
};

export const ToDoStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="To Do" component={ToDoScreen} />
    </Stack.Navigator>
  );
};

export const CalendarStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
};

export const PodcastStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Podcasts" component={PodcastScreen} />
    </Stack.Navigator>
  );
};

export const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <CustomDrawerContent {...props} />
    </DrawerContentScrollView>
  );
}

// name below appears in hamburger menu, but need a space to silence warning

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#001426',
          width: '70%',
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard  "
        component={DashboardStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={dashIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Goals  "
        component={GoalsStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={goalsIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Priority Action Center  "
        component={PACStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={pacIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Relationships  "
        component={RelationshipsStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={relIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Transactions  "
        component={TransactionsStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={transIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Pop-Bys  "
        component={PopByStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={popIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="To Do  "
        component={ToDoStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={todoIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Calendar  "
        component={CalendarStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={calendarIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Podcasts  "
        component={PodcastStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={podcastIcon} style={styles.menuIcon} />,
        }}
      />
      <Drawer.Screen
        name="Settings  "
        component={SettingsStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: (config) => <Image source={settingsIcon} style={styles.menuIcon} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
