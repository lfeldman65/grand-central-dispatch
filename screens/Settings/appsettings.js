import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../constants/analytics';

export default function SettingsScreen(props) {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  function signOutPressed() {
    console.log('Sign Out');
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
    <View style={{ flex: 1, backgroundColor: { isDarkMode }, alignItems: 'center' }}>
      <TouchableOpacity onPress={signOutPressed}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={changeBackground}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.buttonText}>Toggle Dark Mode</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    marginTop: 20,
    color: 'blue',
  },
});
