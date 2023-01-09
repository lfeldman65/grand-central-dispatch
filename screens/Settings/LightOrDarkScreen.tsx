import { Fragment, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import React from 'react';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { lightOrDarkRows, prettyText } from './settingsHelpers';

export default function LightOrDarkScreen(props: any) {
  const [lightOrDark, setIsLightOrDark] = useState(lightOrDarkRows[0]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Light Or Dark Mode',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, lightOrDark]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    var savedMode = await storage.getItem('darkOrLight');
    if (savedMode != null) {
      setIsLightOrDark(savedMode);
      console.log('getCurrent: ' + savedMode);
    } else {
      setIsLightOrDark(lightOrDarkRows[0]);
      console.log('getCurrent: ' + savedMode);
    }
  }

  function savePressed() {
    console.log('save pressed: ' + lightOrDark);
    storage.setItem('darkOrLight', lightOrDark);
    navigation.goBack();
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      {lightOrDarkRows.map((item, index) => (
        <View key={index} style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={lightOrDark == 'dark' ? styles.rowTitleDark : styles.rowTitleLight}>
            {prettyText(lightOrDarkRows[index])}
          </Text>
          <View style={styles.checkView}>
            <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
              size={25}
              textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
              fillColor="#37C0FF"
              unfillColor="white"
              iconStyle={{ borderColor: 'gray' }}
              text=""
              textContainerStyle={{ marginLeft: 10 }}
              disableBuiltInState={true}
              isChecked={lightOrDark == lightOrDarkRows[index]}
              onPress={(isChecked: boolean) => {
                setIsLightOrDark(lightOrDarkRows[index]);
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  checkView: {
    marginTop: 12,
    left: '90%',
    position: 'absolute',
    marginBottom: 12,
  },
  rowTitleDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rowTitleLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
});
