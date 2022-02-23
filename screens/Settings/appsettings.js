import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event} from 'expo-analytics';

const analytics = new Analytics('UA-65596113-1');

export default function SettingsScreen(props) {

  const navigation = useNavigation();

  function signOutPressed() {
    console.log('Sign Out');
    navigation.navigate('Login')
    analytics.event(new Event('Settings', 'Sign Out', 'Pressed', 0))
    .then(() => console.log("button success"))
    .catch(e => console.log(e.message));
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (<MenuIcon />)
    });
  });

  return (
    <TouchableOpacity onPress={signOutPressed}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
         <Text style={styles.signOutText}>Sign Out</Text>
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    alignItems: 'center',
  },
  signOutText: {
    marginTop: 20,
    color: 'blue'
  }
});