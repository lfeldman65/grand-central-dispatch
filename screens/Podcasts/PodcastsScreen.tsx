import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function PodcastsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Podcast Screen</Text>
    </View>
  );
}
