import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';

const eyeClosed = require('../Login/images/eyeClosed.png');
const eyeOpen = require('../Login/images/eyeOpen.png');
const logo = require('../Login/images/iconLogo.png');

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { StatusBar } from 'expo-status-bar';
import { Event } from 'expo-analytics';
import { storage } from '../../utils/storage';
import { analytics } from '../../utils/analytics';
import { loginToApp } from './api';
import { useNavigation, useIsFocused } from '@react-navigation/native';

let deviceWidth = Dimensions.get('window').width;

export default function LoginScreen() {
  const [userName, setUserName] = useState('larryf@buffiniandcompany.com');
  const [password, setPassword] = useState('success');
  const [rememberChecked, setRememberCheck] = useState(false);
  const [showPW, setShowPW] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  function ForgotPasswordPressed() {
    // console.log('Forgot Press');
    // analytics
    //   .event(new Event('Login', 'Forgot Password Button Pressed', 0))
    //   .then(() => console.log('button success'))
    //   .catch((e) => console.log(e.message));
    Linking.openURL('https://signin.buffiniandcompany.com/ForgotPassword?aid=27');

    //  setShowPW(!showPW);
  }
  async function populateCredentialsIfRemembered() {
    const userNameFromStorage = await storage.getItem('userName');
    const pwFromStorage = await storage.getItem('password');
    if (rememberChecked) {
      if (userNameFromStorage != '' && userNameFromStorage != null) {
        setUserName(userNameFromStorage);
      }
      if (pwFromStorage != '' && pwFromStorage != null) {
        setPassword(pwFromStorage);
      }
    } else {
      setUserName('');
      setPassword('');
    }
  }

  function toggleEye() {
    setShowPW(!showPW);
  }

  function saveCredentials(myToken: string) {
    storage.setItem('sessionToken', myToken);
    if (rememberChecked) {
      storage.setItem('userName', userName);
      storage.setItem('password', password);
    } else {
      storage.setItem('userName', '');
      storage.setItem('password', '');
    }
  }

  useEffect(() => {
    //  populateCredentialsIfRemembered();
  }, [isFocused]);

  function HandleLoginPress() {
    //  setIsLoading(true);
    console.log(userName);
    console.log(password);
    analytics
      .event(new Event('Login', 'Login Button', 'Pressed', 0))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));

    if (userName == '' || password == '') {
      console.error('Please enter a Username and Password');
      return;
    }
    loginToApp(userName, password)
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          console.error(res.error);
        } else {
          console.log(res);
          saveCredentials(res.data.token);
          navigation.navigate('Home');
        }
        //   setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.usernameView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#AFB9C2"
          textAlign="left"
          onChangeText={(text) => setUserName(text)}
          defaultValue={userName}
        />
      </View>

      <View style={styles.passwordContainer}>
        <View style={styles.passwordView}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#AFB9C2"
            secureTextEntry={!showPW}
            onChangeText={(text) => setPassword(text)}
            defaultValue={password}
          />
        </View>
        <TouchableOpacity onPress={toggleEye}>
          <Image source={showPW ? eyeClosed : eyeOpen} style={styles.eye} />
        </TouchableOpacity>
        <View style={{ width: 10 }}></View>
      </View>

      <View style={{ flexDirection: 'row', marginLeft: 0 }}>
        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 14 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="Remember Me"
          textContainerStyle={{ marginLeft: 10 }}
          style={styles.checkBox}
          onPress={() => {
            analytics
              .event(new Event('Login', 'Remember Me', 'Pressed', 0))
              .then(() => setRememberCheck(!rememberChecked))
              .catch((e) => console.log(e.message));
          }}
        />

        <TouchableOpacity onPress={ForgotPasswordPressed}>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={HandleLoginPress}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.loginText}>Login</Text>
        </View>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    //alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 210,
    marginBottom: 20,
    marginTop: 20,
  },
  usernameView: {
    backgroundColor: '#002341',
    height: 50,
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    marginBottom: 2,
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: '#002341',
    marginTop: 5,
  },
  passwordView: {
    flex: 1,
    backgroundColor: '#002341',
    height: 50,

    justifyContent: 'center',
    paddingLeft: 10,
  },
  textInput: {
    fontSize: 14,
    color: '#FFFFFF',
    width: 300,
  },

  eye: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#002341',
    //  position: 'absolute',
  },
  loginText: {
    width: 100,
    height: 40,
    marginTop: 25,
    color: '#37C0FF',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 1,
    marginRight: 1,
  },
  forgotText: {
    marginTop: 14,
    color: '#37C0FF',
    fontSize: 14,
    textAlign: 'right',
    position: 'absolute',
    right: 0.05 * deviceWidth,
  },
  checkBox: {
    marginTop: 12,
    flex: 1,
    left: 0.055 * deviceWidth,
  },
});
