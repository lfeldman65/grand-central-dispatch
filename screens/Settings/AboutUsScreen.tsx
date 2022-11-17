import { Fragment, useState } from 'react';
import { StyleSheet, View, Dimensions, Modal, ScrollView, ActivityIndicator, Linking } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { getMedia } from './api';
import { AboutUsDataProps } from './interfaces';
import { analytics } from '../../utils/analytics';
import React from 'react';
import AboutUsRow from './AboutUsRow';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

export default function PodcastsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [aboutUsData, setAboutUsData] = useState<AboutUsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');

  const handleRowPress = (item: AboutUsDataProps) => {
    // analytics.event(new Event('About Us', 'Row', 'Press', 0));
    Linking.openURL(item.url);
  };

  useEffect(() => {
    let isMounted = true;
    getAboutUsList('aboutUs', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function getAboutUsList(type: string, isMounted: boolean) {
    setIsLoading(true);
    getMedia(type)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setAboutUsData(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        ) : (
          <React.Fragment>
            <ScrollView>
              <View>
                {aboutUsData.map((item, index) => (
                  <AboutUsRow key={index} data={item} lightOrDark={lightOrDark} onPress={() => handleRowPress(item)} />
                ))}
              </View>
            </ScrollView>
          </React.Fragment>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  chevron: {
    marginRight: 20,
    marginTop: 5,
    height: 15,
    width: 27,
  },
  filterButton: {
    height: 40,
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#1C6597',
  },
});
