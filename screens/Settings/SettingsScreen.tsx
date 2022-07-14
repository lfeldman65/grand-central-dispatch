import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../constants/analytics';
import { storage } from '../../utils/storage';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isFocused = useIsFocused();

  function signOutPressed() {
    navigation.navigate('Login');
    analytics
      .event(new Event('Settings', 'Sign Out', 'Pressed', 0))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));
  }

  async function getDarkOrLightMode() {
    const dOrLight = await storage.getItem('darkOrLight');
    if (dOrLight == 'dark') {
      setIsDarkMode(true);
      storage.setItem('darkOrLight', 'dark');
      console.log('larry2: ' + dOrLight);
    } else {
      setIsDarkMode(false);
      storage.setItem('darkOrLight', 'light');
      console.log('larry3: ' + dOrLight);
    }
  }

  function changeBackground() {
    if (isDarkMode) {
      setIsDarkMode(false);
      storage.setItem('darkOrLight', 'light');
    } else {
      setIsDarkMode(true);
      storage.setItem('darkOrLight', 'dark');
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  return (
    <View style={isDarkMode ? styles.dark : styles.light}>
      <TouchableOpacity onPress={signOutPressed}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>{Constants.manifest?.version}</Text>

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
    backgroundColor: 'black',
    alignItems: 'center',
  },
  light: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
