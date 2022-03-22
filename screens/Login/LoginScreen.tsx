import { useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';

const eyeClosed = require('../Login/images/eyeClosed.png');
const eyeOpen = require('../Login/images/eyeOpen.png');
const logo = require('../Login/images/iconLogo.png');

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { StatusBar } from 'expo-status-bar';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { storage } from '../../utils/storage';
import { http } from '../../utils/http';
import { analytics } from '../../utils/analytics';
import { loginToApp } from './api';
import { LoginDataProps } from './interfaces';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { set } from 'react-native-reanimated';

let deviceWidth = Dimensions.get('window').width;

export default function LoginScreen({ navigation }) {
  const [userName, setUserName] = useState('larryf@buffiniandcompany.com');
  const [password, setPassword] = useState('success');
  const [rememberChecked, setRememberCheck] = useState(false);
  const [showPW, setShowPW] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  function ForgotPasswordPressed() {
    // console.log('Forgot Press');
    // analytics
    //   .event(new Event('Login', 'Forgot Password Button Pressed', 0))
    //   .then(() => console.log('button success'))
    //   .catch((e) => console.log(e.message));
    // Linking.openURL('https://signin.buffiniandcompany.com/ForgotPassword?aid=27');

    setShowPW(!showPW);
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

  const HandleLoginPressOld = () => {
    // https://aboutreact.com/react-native-login-and-signup/
    analytics
      .event(new Event('Login', 'Login Button', 'Pressed', 0))
      .then(() => console.log('button success'))
      .catch((e) => console.log(e.message));

    if (userName == '' || password == '') {
      alert('Please enter a Username and Password');
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'WNojb250cm9bmRvdZS5hY2Nlc3NYWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYsLndp');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var raw = JSON.stringify({
      email: userName,
      password: password,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      // redirect: 'follow',
    };

    //  http.post('https://www.referralmaker.com/services/mobileapi/login');

    fetch('https://www.referralmaker.com/services/mobileapi/login', requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        //   console.log(result);
        if (result.status == 'error') {
          alert(result.error);
        } else {
          //  saveCredentialsIfRememberChecked();
          navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch((error) => alert('failure ' + error));
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#AFB9C2"
          textAlign="left"
          onChangeText={(text) => setUserName(text)}
          defaultValue={userName}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#AFB9C2"
          secureTextEntry={!showPW}
          onChangeText={(text) => setPassword(text)}
          defaultValue={password}
        />
      </View>

      <View style={{ flexDirection: 'row', paddingLeft: 1 }}>
        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="Remember Me"
          textContainerStyle={{ marginLeft: 15 }}
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
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleEye}>
        <Image source={showPW ? eyeClosed : eyeOpen} style={styles.eye} />
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
    alignItems: 'center',
  },
  logo: {
    width: 173,
    height: 242,
    marginBottom: 20,
    marginTop: 40,
  },
  eye: {
    width: 25,
    height: 25,
    marginBottom: 20,
    marginTop: 40,
  },
  inputView: {
    backgroundColor: '#002341',
    width: 0.9 * deviceWidth,
    height: 50,
    marginBottom: 2,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  loginText: {
    width: 100,
    height: 32,
    marginTop: 25,
    color: '#37C0FF',
    fontSize: 25,
    textAlign: 'center',
  },
  forgotText: {
    width: 200,
    height: 32,
    marginTop: 10,
    color: '#37C0FF',
    fontSize: 18,
    textAlign: 'right',
    paddingRight: 1,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
});
