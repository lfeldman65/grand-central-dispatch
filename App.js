import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack'; 
import { StyleSheet, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

// Sections

import LoginScreen from './screens/login.js';
import DashboardScreen from './screens/Dashboard/dashboard.js';
import GoalsScreen from './screens/Goals/goals';
import PACScreen from './screens/PAC/pac';
import RelationshipsScreen from './screens/Relationships/relationships.js';
import TransactionsScreen from './screens/Transactions/transactions';
import PopBysScreen from './screens/PopBys/popbys';
import ToDoScreen from './screens/ToDo/todos';
import CalendarScreen from './screens/Calendar/calendar';
import PodcastScreen from './screens/Podcasts/podcasts';
import SettingsScreen from './screens/Settings/appsettings.js';

// Hamburger Menu

import hamburgerIcon from './assets/logoWide.png';
import dashIcon from './assets/menuDashboard.png';
import goalsIcon from './assets/menuGoals.png';
import pacIcon from './assets/menuPAC.png';
import relIcon from './assets/menuRel.png';
import transIcon from './assets/menuTransactions.png';
import popIcon from './assets/menuPopBys.png';
import todoIcon from './assets/menuToDo.png';
import calendarIcon from './assets/menuCalendar.png';
import podcastIcon from './assets/menuPodcasts.png';
import settingsIcon from './assets/menuSettings.png';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

const GoalsStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Goals" component={GoalsScreen} />
    </Stack.Navigator>
  );
};

const PACStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="PAC" component={PACScreen} />
    </Stack.Navigator>
  );
};

const RelationshipsStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Relationships" component={RelationshipsScreen} />
    </Stack.Navigator>
  );
};

const TransactionsStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

const PopByStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Pop-Bys" component={PopBysScreen} />
    </Stack.Navigator>
  );
};

const ToDoStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="To Do" component={ToDoScreen} />
    </Stack.Navigator>
  );
};

const CalendarStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
};

const PodcastStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Podcasts" component={PodcastScreen} />
    </Stack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <Image source={hamburgerIcon} style={styles.menuImage} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// name below appears in hamburger menu, but need a space to silence warning

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
        drawerStyle: {
        backgroundColor: 'blue',
        width: 240,
        drawerInactiveBackgroundColor: 'red',
        activeTintColor: 'white', /* font color for active screen label */
        activeBackgroundColor: 'orange', /* bg color for active screen */
        inactiveTintColor: 'yellow', /* Font color for inactive screens' labels */
        activeTintColor: 'yellow',
       },
      }}>
      <Drawer.Screen name="Dashboard  " component={DashboardStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {dashIcon} style={styles.menuIcon}/>
       }} />
      <Drawer.Screen name="Goals  " component={GoalsStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {goalsIcon} style={styles.menuIcon}/>
       }} />
      <Drawer.Screen name="Priority Action Center  " component={PACStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {pacIcon} style={styles.menuIcon}/>
       }} />     
      <Drawer.Screen name="Relationships  " component={RelationshipsStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {relIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="Transactions  " component={TransactionsStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {transIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="Pop-Bys  " component={PopByStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {popIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="To Do  " component={ToDoStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {todoIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="Calendar  " component={CalendarStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {calendarIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="Podcasts  " component={PodcastStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {podcastIcon} style={styles.menuIcon}/>
       }} />
       <Drawer.Screen name="Settings  " component={SettingsStackNavigator} options={{headerShown: false, drawerIcon: config=><Image source = {settingsIcon} style={styles.menuIcon}/>
       }} />  
    </Drawer.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
   <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}  />
        <Stack.Screen name="Home" component={DrawerNavigator}  options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: -20
  },
  menuImage: {
    height: 50,
    width: 300,
    
  },
  drawer: {
    color: '#004F89'
  },
});

export default App
