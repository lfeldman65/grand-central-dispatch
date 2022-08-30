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
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';

export default function PodcastsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [socialData, setSocialData] = useState<AboutUsDataProps[]>([]);
  const [moreLinksData, setMoreLinksData] = useState<AboutUsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (item: AboutUsDataProps) => {
    // analytics.event(new Event('About Us', 'Row', 'Press', 0));
    Linking.openURL(item.url);
  };

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getAboutUsList('moreSocial', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getAboutUsList('moreLinks', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function getAboutUsList(type: string, isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    setIsLoading(true);
    getMedia(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          if (type == 'moreLinks') {
            setMoreLinksData(res.data);
          } else {
            setSocialData(res.data);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            <View>
              {moreLinksData.map(
                (item, index) =>
                  item.title != 'About Us' && (
                    <AboutUsRow key={index} data={item} onPress={() => handleRowPress(item)} />
                  )
              )}
            </View>
            <View>
              {socialData.map((item, index) => (
                <AboutUsRow key={index} data={item} onPress={() => handleRowPress(item)} />
              ))}
            </View>
          </ScrollView>
        </React.Fragment>
      )}
    </View>
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
