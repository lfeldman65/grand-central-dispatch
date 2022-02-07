import { StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

// Sections

import LoginScreen from '../../screens/login.js';
import DashboardScreen from '../../screens/Dashboard/dashboard.js';
import GoalsScreen from '../../screens/Goals/goals.js';
import PACScreen from '../../screens/PAC/pac.js';
import RelationshipsScreen from '../../screens/Relationships/relationships.js';
import TransactionsScreen from '../../screens/Transactions/transactions.js';
import PopBysScreen from '../../screens/PopBys/popbys.js';
import ToDoScreen from '../../screens/ToDo/todos.js';
import CalendarScreen from '../../screens/Calendar/calendar.js';
import PodcastScreen from '../../screens/Podcasts/podcasts.js';
import SettingsScreen from '../../screens/Settings/appsettings.js';

// Components
import CustomDrawerContent from './CustomDrawerContent.js';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard', headerTintColor: 'white', headerStyle: {
            backgroundColor: '#1A6295',
          }, }} />






      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="PAC" component={PACScreen} options={{ title: 'Priority Action Center' }} />
      <Stack.Screen name="Relationships" component={RelationshipsScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Pop-Bys" component={PopBysScreen} options={{ title: 'Pop-By' }} />
      <Stack.Screen name="To-Do" component={ToDoScreen} options={{ title: 'To Do' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Podcasts" component={PodcastScreen} />
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
        name="Home Screen"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
