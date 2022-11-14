
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage'
import { Appearance } from 'react-native';

export var lightOrDark: string | undefined | null= 'light';
//let colorScheme = useColorScheme();
//export const [lightOrDark, setIsLightOrDark] = useState<String | null | undefined>('');


export async function getDarkOrLightMode() {
    lightOrDark = await storage.getItem('darkOrLight');
    //console.log('dOrlight: ' + dOrlight)
    
    //if it's null, it's automatic
    if ((lightOrDark == null) || (lightOrDark == undefined) || (lightOrDark == 'automatic')) {
        lightOrDark = Appearance.getColorScheme();
    }
}

Appearance.addChangeListener(({ colorScheme }) => {
    console.log('got here ' + colorScheme);
    lightOrDark = colorScheme;
});

