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
    console.log('onThemeChange', colorScheme);
    console.log('lightOrDarkLocal ' + lightOrDarkLocal);

    if (lightOrDarkLocal == 'automatic') {
      setLightOrDark(colorScheme);
      console.log('color scheme: ' + colorScheme);
    } else {
      setLightOrDark(lightOrDarkLocal);
    }
    console.log('LIGHTORDARKLOCAL1: ' + typeof lightOrDarkLocal);

    if (typeof setLightOrDarkLabel !== 'undefined') {
      console.log('LIGHTORDARKLOCAL1: ' + lightOrDarkLocal);

      setLightOrDarkLabel(lightOrDarkLocal);
    }
  };

  useEffect(() => {
    console.log('useEffect in DarkOrLight');
    getDarkOrLightMode();
    eventEmitterSubscription = Appearance.addChangeListener(onThemeChange);
    return () => {
      eventEmitterSubscription.remove();
      //Appearance.removeChangeListener(onThemeChange);
    };
  }, []);

  useEffect(() => {
    console.log('useEffect in DarkOrLight');
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
      console.log('THEME: ' + d);
      var dd = Appearance.getColorScheme();
      console.log('APPEARANCE: ' + dd);
      lightOrDarkLocal = 'automatic';
      setLightOrDark(dd);
    } else {
      lightOrDarkLocal = d;
      setLightOrDark(d);
    }

    if (typeof setLightOrDarkLabel !== 'undefined') {
      console.log('LIGHTORDARKLOCAL2: ' + lightOrDarkLocal);

      setLightOrDarkLabel(lightOrDarkLocal);
    }
  }

  return <View></View>;
}
