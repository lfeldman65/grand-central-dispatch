import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import GoalsScreen from '../screens/Goals/GoalsScreen';
import PACScreen from '../screens/PAC/PACScreen';
import PACDetailScreen from '../screens/PAC/PACDetailScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsSection';
import PopBysScreen from '../screens/PopBys/PopBysScreen';
import ToDoScreen from '../screens/ToDo/ToDosScreen';
import ToDoDetails from '../screens/ToDo/ToDoDetails';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import PodcastScreen from '../screens/Podcasts/PodcastsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ManageRelationshipsScreen from '../screens/Relationships/ManageRelationshipsScreen';
import RelationshipDetailsScreen from '../screens/Relationships/RelationshipDetailsScreen';
import RecentContactActivityScreen from '../screens/Relationships/RecentActivityScreen';
import VideoHistoryScreen from '../screens/Relationships/VideoHistoryScreen';
import VideoDetailsScreen from '../screens/Relationships/VideoDetailsScreen';
import RealEstateTransactionsScreen from '../screens/Transactions/RealEstateTransactionsScreen';
import LenderTransactionsScreen from '../screens/Transactions/LenderTransactionsScreen';
import OtherTransactionsScreen from '../screens/Transactions/OtherTransactionsScreen';
import TransactionDetailsRE from '../screens/Transactions/TransactionDetailsRE';
import LandingScreen from '../screens/Settings/LandingScreen';

export type RootStackParamList = {
  [x: string]: any;
};

import NavigationContent from './NavigationContent';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

export const PopByStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PopBysScreen1"
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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
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

export const ToDoStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="toDoScreen"
        component={ToDoScreen}
        options={{
          title: 'To-Do',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="toDoDetails"
        component={ToDoDetails}
        options={{
          title: 'To Do Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
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

export const RealTxStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RealEstateTransactions"
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
        name="RealEstateTxDetails"
        component={TransactionDetailsRE}
        options={{
          title: 'Transaction Details',
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

export const LenderTxStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LenderTransactions"
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
        name="LenderTxDetails"
        component={TransactionDetailsRE}
        options={{
          title: 'Transaction Details',
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

export const OtherTxStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OtherTransactions"
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
        name="OtherTxDetails"
        component={TransactionDetailsRE}
        options={{
          title: 'Transaction Details',
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
    </Stack.Navigator>
  );
};

export const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{
          title: 'Select Landing Page',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      {/* <Stack.Screen
        name="RelOrderScreen"
        component={RelOrderScreen}
        options={{
          title: 'Display Relationships A - Z',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export const RelStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="manageRelationships"
        component={ManageRelationshipsScreen}
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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
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

export const RecentActivityStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecentContactActivityScreen"
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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
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

export const VideoStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VideoHistoryScreen"
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
        name="VideoDetailsScreen"
        component={VideoDetailsScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
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
        name="Dashboard" // must match exactly name in NavigationContent
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
        name="goals"
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
        name="Rolodex"
        component={RelStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RecentActivity"
        component={RecentActivityStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="VideoStack"
        component={VideoStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          headerBackVisible: false,
          headerShown: false,
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
        name="RETransactionsMenu" // must match Dashboard
        component={RealTxStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="LenderTransactionsMenu"
        component={LenderTxStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="OtherTransactionsMenu"
        component={OtherTxStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PopBysScreen"
        component={PopByStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="To-Do"
        component={ToDoStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
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
          title: 'Podcasts',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="SettingsScreenNav"
        component={SettingsStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
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
