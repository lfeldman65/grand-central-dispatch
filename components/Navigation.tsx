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
import ApptDetails from '../screens/Calendar/AppointmentDetails';
import PodcastScreen from '../screens/Podcasts/PodcastsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ManageRelationshipsScreen from '../screens/Relationships/ManageRelationshipsScreen';
import RelationshipDetailsScreen from '../screens/Relationships/RelationshipDetailsScreen';
import EditRelationshipScreen from '../screens/Relationships/EditRelationshipScreen';
import GroupMembersScreen from '../screens/Relationships/GroupMembersScreen';
import RecentContactActivityScreen from '../screens/Relationships/RecentActivityScreen';
import VideoHistoryScreen from '../screens/Relationships/VideoHistoryScreen';
import VideoDetailsScreen from '../screens/Relationships/VideoDetailsScreen';
import RealEstateTransactionsScreen from '../screens/Transactions/RealEstateTransactionsScreen';
import LenderTransactionsScreen from '../screens/Transactions/LenderTransactionsScreen';
import OtherTransactionsScreen from '../screens/Transactions/OtherTransactionsScreen';
import AddTxMenu from '../screens/Transactions/AddTransactionMenu';
import AddOrEditRealtorTx1 from '../screens/Transactions/AddOrEditRealtorTx1';
import AddOrEditRealtorTx2 from '../screens/Transactions/AddOrEditRealtorTx2';
import AddOrEditRealtorTx3 from '../screens/Transactions/AddOrEditRealtorTx3';
import AddOrEditLenderTx1 from '../screens/Transactions/AddOrEditLenderTx1';
import AddOrEditLenderTx2 from '../screens/Transactions/AddOrEditLenderTx2';
import AddOrEditLenderTx3 from '../screens/Transactions/AddOrEditLenderTx3';
import AddOrEditOtherTx1 from '../screens/Transactions/AddOrEditOtherTx1';
import AddOrEditOtherTx2 from '../screens/Transactions/AddOrEditOtherTx2';
import TransactionDetailsRE from '../screens/Transactions/TransactionDetailsRE';
import TransactionDetailsLender from '../screens/Transactions/TransactionDetailsLender';
import TransactionDetailsOther from '../screens/Transactions/TransactionDetailsOther';
import Profile1 from '../screens/Settings/ProfileScreen1';
import Profile2 from '../screens/Settings/ProfileScreen2';
import Sort1 from '../screens/Settings/SortScreen1';
import Sort2 from '../screens/Settings/SortScreen2';
import ImportRel1 from '../screens/Settings/ImportRelScreen1';
import ImportRel2 from '../screens/Settings/ImportRelScreen2';
import BizGoals from '../screens/Settings/BizGoalsScreen';
import BizGoalsReview from '../screens/Settings/BizGoalsReviewScreen';
import Tutorial1 from '../screens/Settings/Tutorial1';
import AboutUs from '../screens/Settings/AboutUsScreen';
import LandingScreen from '../screens/Settings/LandingScreen';
import RelOrderScreen from '../screens/Settings/RelOrderScreen';
import LightOrDarkScreen from '../screens/Settings/LightOrDarkScreen';
import NotificationsScreen from '../screens/Settings/NotificationsScreen';

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
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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

      <Stack.Screen
        name="AddTxMenu"
        component={AddTxMenu}
        options={{
          title: 'Add Transaction',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx1"
        component={AddOrEditRealtorTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx2"
        component={AddOrEditRealtorTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx3"
        component={AddOrEditRealtorTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx1"
        component={AddOrEditLenderTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx2"
        component={AddOrEditLenderTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx3"
        component={AddOrEditLenderTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx1"
        component={AddOrEditOtherTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx2"
        component={AddOrEditOtherTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="LenderTxDetails"
        component={TransactionDetailsLender}
        options={{
          title: 'Transaction Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddTxMenu"
        component={AddTxMenu}
        options={{
          title: 'Add Transaction',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx1"
        component={AddOrEditRealtorTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx2"
        component={AddOrEditRealtorTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx3"
        component={AddOrEditRealtorTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx1"
        component={AddOrEditLenderTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx2"
        component={AddOrEditLenderTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx3"
        component={AddOrEditLenderTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx1"
        component={AddOrEditOtherTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx2"
        component={AddOrEditOtherTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

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
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="OtherTxDetails"
        component={TransactionDetailsOther}
        options={{
          title: 'Transaction Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddTxMenu"
        component={AddTxMenu}
        options={{
          title: 'Add Transaction',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx1"
        component={AddOrEditRealtorTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx2"
        component={AddOrEditRealtorTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx3"
        component={AddOrEditRealtorTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx1"
        component={AddOrEditLenderTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx2"
        component={AddOrEditLenderTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx3"
        component={AddOrEditLenderTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx1"
        component={AddOrEditOtherTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx2"
        component={AddOrEditOtherTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

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

      <Stack.Screen
        name="RelDetails"
        component={RelationshipDetailsScreen}
        options={{
          title: '',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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

export const BizGoalsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BizGoalsScreen"
        component={BizGoals}
        options={{
          title: 'Welcome',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="BizGoalsReview"
        component={BizGoalsReview}
        options={{
          title: 'Welcome',
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

export const ImportStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ImportRel1"
        component={ImportRel1}
        options={{
          title: 'Import Relationships',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="ImportRel2"
        component={ImportRel2}
        options={{
          title: 'Import Relationships',
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

export const SortStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sort1"
        component={Sort1}
        options={{
          title: 'Sorting Relationships',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="Sort2"
        component={Sort2}
        options={{
          title: 'Mailing Address',
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

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile1"
        component={Profile1}
        options={{
          title: 'Welcome',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="Profile2"
        component={Profile2}
        options={{
          title: 'Mailing Address',
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

export const TutorialStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tutorial1"
        component={Tutorial1}
        options={{
          title: 'Tutorial',
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
        name="ProfileStackNavigator"
        component={ProfileStackNavigator}
        options={{
          headerBackVisible: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BizGoalsStackNavigator"
        component={BizGoalsStackNavigator}
        options={{
          headerBackVisible: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ImportStackNavigator"
        component={ImportStackNavigator}
        options={{
          headerBackVisible: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SortStackNavigator"
        component={SortStackNavigator}
        options={{
          headerBackVisible: true,
          headerShown: false,
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

      <Stack.Screen
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
      />

      <Stack.Screen
        name="LightOrDarkScreen"
        component={LightOrDarkScreen}
        options={{
          title: 'Light Or Dark Mode',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="TutorialStackNavigator"
        component={TutorialStackNavigator}
        options={{
          headerBackVisible: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUs}
        options={{
          title: 'About Us',
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
        name="GroupMembersScreen"
        component={GroupMembersScreen}
        options={{
          title: 'Group Members',
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
          title: 'RelDetails',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddTxMenu"
        component={AddTxMenu}
        options={{
          title: 'Add Transaction',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx1"
        component={AddOrEditRealtorTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx2"
        component={AddOrEditRealtorTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditRealtorTx3"
        component={AddOrEditRealtorTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx1"
        component={AddOrEditLenderTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx2"
        component={AddOrEditLenderTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLenderTx3"
        component={AddOrEditLenderTx3}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx1"
        component={AddOrEditOtherTx1}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditOtherTx2"
        component={AddOrEditOtherTx2}
        options={{
          title: 'Buyer Details',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#1A6295',
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="EditRelationshipScreen"
        component={EditRelationshipScreen}
        options={{
          title: 'Details',
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

export const CalendarStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarScreen2"
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
        name="ApptDetails"
        component={ApptDetails}
        options={{
          title: 'Appointment Details',
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
          headerBackVisible: false,
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
        component={CalendarStackNavigator}
        options={{
          headerBackVisible: false,
          headerShown: false,
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
