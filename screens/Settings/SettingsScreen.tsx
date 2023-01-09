import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { storage } from '../../utils/storage';
import { getProfileData } from './api';
import { ProfileDataProps } from './interfaces';
import Constants from 'expo-constants';
import { landingPages, displayAZRows, lightOrDarkRows, prettyText } from './settingsHelpers';
const chevron = require('../../images/chevron_white_right.png');
const person = require('../Settings/images/user.png');

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [lightOrDark, setLightOrDark] = useState(lightOrDarkRows[0]);
  const [profileData, setProfileData] = useState<ProfileDataProps>();
  const [date, setDate] = useState(new Date());
  const isFocused = useIsFocused();
  const [landingPage, setLandingPage] = useState(landingPages[0]);
  const [displayAZ, setDisplayAZ] = useState(displayAZRows[0]);

  function signOutPressed() {
    navigation.navigate('Login');
  }

  function changePasswordPressed() {
    Linking.openURL('https://signin.buffiniandcompany.com/ForgotPassword?aid=27');
  }

  function profilePressed() {
    navigation.navigate('ProfileStackNavigator');
  }

  function businessGoalsPressed() {
    navigation.navigate('BizGoalsStackNavigator');
  }

  function importPressed() {
    console.log('import relationshps');
  }

  function sortPressed() {
    console.log('sort relationships');
  }

  function landingPagePressed() {
    console.log('landing page');
    navigation.navigate('LandingScreen');
  }

  function displayAZPressed() {
    console.log('display A-Z');
    navigation.navigate('RelOrderScreen');
  }

  function lightOrDarkPressed() {
    console.log('light or dark');
    navigation.navigate('LightOrDarkScreen');
  }

  function notificationsPressed() {
    console.log('notifications');
    navigation.navigate('NotificationsScreen');
  }

  function tutorialPressed() {
    console.log('tutorial');
  }

  function aboutUsPressed() {
    navigation.navigate('AboutUsScreen');
  }

  function ratePressed() {
    console.log('rate');
    Linking.openURL('https://apps.apple.com/us/app/referral-maker-crm/id1097338930');
  }

  function privacyPressed() {
    Linking.openURL('https://www.buffiniandcompany.com/privacy-policy.aspx');
  }

  function termsPressed() {
    Linking.openURL('https://buffiniandcompany.com/terms');
  }

  function fetchProfile(isMounted: boolean) {
    getProfileData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setProfileData(res.data);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var savedState = await storage.getItem('darkOrLight');
    if (savedState == null) {
      setLightOrDark(lightOrDarkRows[0]);
    } else {
      setLightOrDark(savedState);
    }
  }

  async function getDisplayAZ(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var stored = await storage.getItem('displayAZ');
    if (stored != null) {
      setDisplayAZ(stored);
    } else {
      setDisplayAZ('First Last');
    }
  }

  async function getCurrentLandingPage(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var storedLanding = await storage.getItem('landingPage');
    if (storedLanding != null) {
      setLandingPage(storedLanding);
    } else {
      setLandingPage('Dashboard');
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getCurrentLandingPage(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getDisplayAZ(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => {
      isMounted = false;
    };
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
        <TouchableOpacity onPress={profilePressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Set Up Profile</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={businessGoalsPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Set Your Business Goals</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={importPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Import Relationships</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={sortPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Sort Relationships</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerRow}>Display and Features</Text>

        <TouchableOpacity onPress={landingPagePressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBoxSupp}>
              <Text style={styles.activityText}>Landing Page</Text>
            </View>
            <Text style={styles.suppText}>{landingPage}</Text>

            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={displayAZPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBoxSupp}>
              <Text style={styles.activityText}>Display Relationships A - Z</Text>
            </View>
            <Text style={styles.suppText}>{displayAZ}</Text>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={lightOrDarkPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBoxSupp}>
              <Text style={styles.activityText}>Light or Dark Mode</Text>
            </View>
            <Text style={styles.suppText}>{prettyText(lightOrDark)}</Text>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={notificationsPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Notifications</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={tutorialPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Tutorial</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerRow}>Buffini and Company</Text>

        <TouchableOpacity onPress={aboutUsPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>About Us</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={ratePressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Rate in App Store</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={privacyPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Privacy Policy</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={termsPressed}>
          <View style={styles.pressableRow}>
            <View style={styles.textBox}>
              <Text style={styles.activityText}>Terms of Service</Text>
            </View>
            <View style={styles.chevronBox}>
              <Image source={chevron} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.bottomContainer} onPress={signOutPressed}>
          <View style={styles.signOutButton}>
            <Text style={styles.signOutText}>{'Sign Out'}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.versionText}>{'Version ' + Constants.manifest?.version} </Text>
        <Text style={styles.copyrightText}>
          {'@ ' +
            date.toLocaleDateString('en-us', {
              year: 'numeric',
            }) +
            ' Buffini and Company'}
        </Text>
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
    width: '70%',
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
    width: '60%',
    textAlign: 'left',
    marginLeft: -10,
  },
  suppText: {
    paddingTop: 13,
    height: 40,
    width: '40%',
    textAlign: 'right',
    marginLeft: -30,
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
