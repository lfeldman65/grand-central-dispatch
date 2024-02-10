import { Button, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
// Components
import DrawerNavigator from './components/Navigation';
import LoginScreen from './screens/Login/LoginScreen';
import * as Sentry from 'sentry-expo';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import AppContext, { GlobalStuff } from './components/AppContext';
import { Audio } from 'expo-av';
import { PlayerStatus } from './screens/Podcasts/interfaces';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
Sentry.init({
  dsn: 'https://5d41131fe4fe4da196a07aa43c9c205f@o1223915.ingest.sentry.io/6368678',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  enableNative: true,
});
const Stack = createNativeStackNavigator();
const MainStackNavigator = () => {
  // test
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
function App() {
  const [sound, setSound] = useState<Audio.Sound | null>();
  const [podcastId, setPodcastId] = useState(-1);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: true,
    isPlaying: false,
    isBuffering: true,
    muted: false,
    //isLoading: true,
    //isSeeking: false
  });
  const globalObjects: GlobalStuff = {
    sound: sound,
    setSound: setSound,
    podcastId: podcastId,
    setPodcastId: setPodcastId,
    playerStatus: playerStatus,
    setPlayerStatus: setPlayerStatus,
  };
  return (
    <ActionSheetProvider>
      <AppContext.Provider value={globalObjects}>
        <SafeAreaView style={styles.container}>
          <StatusBar />
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </AppContext.Provider>
    </ActionSheetProvider>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1A6295',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
