import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../constants/analytics';
import { storage } from '../../utils/storage';
import { getProfileData } from './api';
import { ProfileProps } from './interfaces';
import Constants from 'expo-constants';
const chevron = require('../../images/chevron_white_right.png');
const person = require('../Settings/images/user.png');

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileProps>();
  const [date, setDate] = useState(new Date());
  const isFocused = useIsFocused();

  function signOutPressed() {
    navigation.navigate('Login');
    analytics
      .event(new Event('Settings', 'Sign Out', 'Pressed', 0))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));
  }

  function changePasswordPressed() {
    console.log('change password');
  }

  function profilePressed() {
    console.log('set up profile');
  }

  function businessGoalsPressed() {
    console.log('set your business goals');
  }

  function importPressed() {
    console.log('import relationshps');
  }

  function sortPressed() {
    console.log('sort relationships');
  }

  function landingPagePressed() {
    console.log('landing page');
  }

  function displayAZPressed() {
    console.log('display A-Z');
  }

  function lightOrDarkPressed() {
    console.log('light or dark');
    changeBackground();
  }

  function notificationsPressed() {
    console.log('notifications');
  }

  function tutorialPressed() {
    console.log('tutorial');
  }

  function aboutUsPressed() {
    console.log('about us');
  }

  function ratePressed() {
    console.log('rate');
  }

  function privacyPressed() {
    console.log('privacy');
  }

  function termsPressed() {
    console.log('terms');
  }

  function fetchGoals() {
    getProfileData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          setProfileData(res.data);
        }
      })
      .catch((error) => console.error('failure ' + error));
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
    getDarkOrLightMode();
    fetchGoals();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.imageBox}>
          <Image source={person} style={styles.personImage} />
        </View>
        <View style={styles.userNameView}>
          <Text style={styles.userText}>{profileData != null ? profileData.email : ''}</Text>
          <Text onPress={changePasswordPressed} style={styles.changePasswordText}>
            Change Password
          </Text>
        </View>
      </View>
      <ScrollView>
        <Text style={styles.headerRow}>Set Up</Text>

        <Text style={styles.headerRow}>Display and Features</Text>

        <TouchableOpacity onPress={lightOrDarkPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBoxSupp}>
              <Text style={styles.activityText}>Light or Dark Mode</Text>
            </View>
            <Text style={styles.suppText}>{isDarkMode ? 'Dark' : 'Light'}</Text>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerRow}>Buffini and Company</Text>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.bottomContainer} onPress={signOutPressed}>
          <View style={styles.signOutButton}>
            <Text style={styles.signOutText}>{'Sign Out'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  topView: {
    height: 80,
    backgroundColor: '#1A6295',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: 'white',
  },
  imageBox: {
    width: 40,
    height: 40,
    paddingTop: 20,
    marginRight: 30,
  },
  personImage: {
    height: 40,
    width: 40,
    marginLeft: 15,
    marginRight: 5,
    alignItems: 'center',
  },
  userNameView: {
    flexDirection: 'column',
    width: '60%',
    marginLeft: 5,
    textAlign: 'left',
  },
  changePasswordText: {
    marginTop: 10,
    color: '#1398F5',
  },
  userText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
  headerRow: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#04121b',
    paddingTop: 15,
    height: 50,
  },
  signOutButton: {
    marginTop: 15,
    backgroundColor: '#1A6295',
    paddingTop: 7,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 40,
    width: 100,
    alignSelf: 'center',
  },
  signOutText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  bottomView: {
    borderTopColor: 'white',
    borderWidth: 0.5,
    height: 110,
    backgroundColor: '#1A6295',
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 50,
  },
  versionText: {
    marginTop: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  copyrightText: {
    marginTop: 5,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  pressableRow: {
    flexDirection: 'row',
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
    backgroundColor: '#012845',
    paddingTop: 2,
    height: 50,
    borderColor: '#1A6295',
    borderWidth: 0.5,
    paddingLeft: 10,
  },
  textBox: {
    height: 40,
    width: '92%',
    textAlign: 'left',
    marginLeft: -10,
  },
  activityText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 14,
  },
  textBoxSupp: {
    height: 40,
    width: '45%',
    textAlign: 'left',
    marginLeft: -10,
  },
  suppText: {
    paddingTop: 13,
    height: 40,
    width: '45%',
    textAlign: 'right',
    marginLeft: 10,
    color: '#1398F5',
    fontSize: 14,
    paddingRight: 8,
  },
  chevronBox: {
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 20,
  },
  chevron: {
    height: 18,
    width: 10,
  },
});
