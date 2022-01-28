import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/menuIcon';

import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function DashboardScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="dark" translucent={false} backgroundColor="white" barStyle="light-content" />
      <Text>Dashboard Screen</Text>
    </View>
  );
}
