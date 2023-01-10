import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from './storage';
import { Appearance } from 'react-native';

var lightOrDarkLocal = 'automatic';
let eventEmitterSubscription: any;

export default function DarkOrLightScreen(props: any) {
  const { setLightOrDark } = props;

  const onThemeChange = ({ colorScheme }) => {
    console.log('onThemeChange', colorScheme);
    console.log('lightOrDarkLocal ' + lightOrDarkLocal);

    if (lightOrDarkLocal == 'automatic') {
      setLightOrDark(colorScheme);
    } else {
      setLightOrDark(lightOrDarkLocal);
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
  }

  return <View></View>;
}
