import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from './storage';
import { Appearance } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
var lightOrDarkLocal = 'automatic';
let eventEmitterSubscription: any;
export default function DarkOrLightScreen(props: any) {
  const { setLightOrDark } = props;
  const { setLightOrDarkLabel } = props;
  const isFocused = useIsFocused();
  const onThemeChange = ({ colorScheme }) => {
    if (lightOrDarkLocal == 'automatic') {
      setLightOrDark(colorScheme);
      setLightOrDark('');
      const timer2 = setInterval(() => {
        clearInterval(timer2);
        setLightOrDark(colorScheme);
      }, 100);
    } else {
      setLightOrDark(lightOrDarkLocal);
    }
    if (typeof setLightOrDarkLabel !== 'undefined') {
      setLightOrDarkLabel(lightOrDarkLocal);
    }
  };
  useEffect(() => {
    // console.log('useEffect in DarkOrLight');
    getDarkOrLightMode();
    eventEmitterSubscription = Appearance.addChangeListener(onThemeChange);
    return () => {
      eventEmitterSubscription.remove();
      //Appearance.removeChangeListener(onThemeChange);
    };
  }, []);
  useEffect(() => {
    // console.log('useEffect in DarkOrLight');
    getDarkOrLightMode();
    eventEmitterSubscription = Appearance.addChangeListener(onThemeChange);
    return () => {
      eventEmitterSubscription.remove();
      //Appearance.removeChangeListener(onThemeChange);
    };
  }, [isFocused]);
  async function getDarkOrLightMode() {
    var d = await storage.getItem('darkOrLight');
    if (d == null || d == undefined || d == 'automatic') {
      // console.log('THEME: ' + d);
      var dd = Appearance.getColorScheme();
      //   console.log('APPEARANCE: ' + dd);
      lightOrDarkLocal = 'automatic';
      setLightOrDark(dd);
    } else {
      lightOrDarkLocal = d;
      setLightOrDark(d);
    }
    if (typeof setLightOrDarkLabel !== 'undefined') {
      //  console.log('LIGHTORDARKLOCAL2: ' + lightOrDarkLocal);
      setLightOrDarkLabel(lightOrDarkLocal);
    }
  }
  return <View></View>;
}
