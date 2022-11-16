import { Button, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from './storage'
import { Appearance } from 'react-native';

export default function DarkOrLightScreen(props) {

    const {setLightOrDark} = props;

    const onThemeChange = ({ colorScheme }) => {
        console.log("onThemeChange", colorScheme)
        //dispatch(changeTheme(colorScheme));
        setLightOrDark(colorScheme);
    }


    useEffect(() => {

        getDarkOrLightMode();

        Appearance.addChangeListener(onThemeChange);
        return () => {
          Appearance.removeChangeListener(onThemeChange);
        };
      }, []);

    
    async function getDarkOrLightMode() {
        var d = await storage.getItem('darkOrLight');
        
        //if it's null, it's automatic
        if ((d == null) || (d == undefined) || (d == 'automatic')) {
            var dd = Appearance.getColorScheme();
            setLightOrDark(dd);
        }
        else {
            setLightOrDark(d);
        }
    }

    return (
        <View >
         
        </View>
      );
}




