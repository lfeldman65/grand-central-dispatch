import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

// Sections test

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import GoalsScreen from '../screens/Goals/goals';
import PACScreen from '../screens/PAC/PACScreen';
import PACDetailScreen from '../screens/PAC/PACDetailScreen';
import RelationshipsScreen from '../screens/Relationships/RelationshipsScreen';
import PACCompleteScreen from '../screens/PAC/PACCompleteScreen';
import TransactionsScreen from '../screens/Transactions/transactions';
import PopBysScreen from '../screens/PopBys/PopBysScreen';
import ToDoScreen from '../screens/ToDo/todos';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import PodcastScreen from '../screens/Podcasts/PodcastsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

import ManageRelationshipsScreen from '../screens/Relationships/ManageRelationshipsScreen';
import RecentContactActivityScreen from '../screens/Relationships/recentcontactactivity';
import VideoHistoryScreen from '../screens/Relationships/videoHistory';

import RealEstateTransactionsScreen from '../screens/Transactions/realEstateTransactions';
import LenderTransactionsScreen from '../screens/Transactions/LenderTransactionsScreen';
import OtherTransactionsScreen from '../screens/Transactions/otherTransactions';

export type RootStackParamList = {
  [x: string]: any;
};

import NavigationContent from './NavigationContent';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

export const PACStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PAC1"
        component={PACScreen}
        options={{
          title: 'Priority Action Center',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="PACDetail"
        component={PACDetailScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="PACCompleteScreen"
        component={PACCompleteScreen}
        options={{
          title: 'Name',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
};

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard" // must match exactly name in CustomDrawerContent
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          title: 'Goals',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="PAC"
        component={PACStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="relationships"
        component={RelationshipsScreen}
        options={{
          title: 'Relationships',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="manageRelationships"
        component={ManageRelationshipsScreen}
        options={{
          title: 'Manage Relationships',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="recentcontactactivity"
        component={RecentContactActivityScreen}
        options={{
          title: 'Recent Contact Activity',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="videoHistory"
        component={VideoHistoryScreen}
        options={{
          title: 'Video History',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="realEstateTransactions"
        component={RealEstateTransactionsScreen}
        options={{
          title: 'Real Estate Transactions',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="LenderTransactionsScreen"
        component={LenderTransactionsScreen}
        options={{
          title: 'Lender Transactions',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="otherTransactions"
        component={OtherTransactionsScreen}
        options={{
          title: 'Other Transactions',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="PopBysScreen"
        component={PopBysScreen}
        options={{
          title: 'Pop-By',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="To-Do"
        component={ToDoScreen}
        options={{
          title: 'To Do',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          title: 'CalendarScreeen',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="PodcastsScreen"
        component={PodcastScreen}
        options={{
          title: 'PodcastsScreen',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'SettingsScreen',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

function DrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <NavigationContent {...props} />
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
          width: '80%',
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
