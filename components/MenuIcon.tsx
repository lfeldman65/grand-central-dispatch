import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Menu } from 'react-native-feather';

export default function MenuIcon() {
  const navigation = useNavigation();

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, []);

  return (
    <TouchableOpacity onPress={openDrawer}>
      <Menu style={{ marginRight: 10, marginTop: 3 }} stroke="white" />
    </TouchableOpacity>
  );
}