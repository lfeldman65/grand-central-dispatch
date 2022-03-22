import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../constants/analytics'; // why me?

export default function SettingsScreen(props: any) {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  function signOutPressed() {
    navigation.navigate('Login');
    analytics
      .event(new Event('Settings', 'Sign Out', 'Pressed', 0))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));
  }

  function changeBackground() {
    console.log(isDarkMode);
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => <MenuIcon />,
    });
  });

  return (
    <View style={isDarkMode ? styles.dark : styles.light}>
      <TouchableOpacity onPress={signOutPressed}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Sign Out</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={changeBackground}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Toggle Dark Mode</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lightButtonText: {
    marginTop: 20,
    color: 'blue',
  },

  darkButtonText: {
    marginTop: 20,
    color: 'white',
  },
  dark: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },

  light: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
});