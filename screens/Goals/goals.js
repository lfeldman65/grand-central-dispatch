import {useState} from "react"; 
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function GoalsScreen() {

const navigation = useNavigation();

useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<MenuIcon/>)
    });
  });
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Goals Screen</Text>
    </View>
  );
}