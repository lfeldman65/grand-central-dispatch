import { Fragment, useState } from 'react';
import { StyleSheet, View, Dimensions, Modal, ScrollView, ActivityIndicator } from 'react-native';
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
  let deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [data, setData] = useState<AboutUsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [modalPlayerVisible, setModalPlayerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (index: number) => {
    // analytics.event(new Event('Video Summary', 'Row', 'Press', 0));
    console.log('About Us Row Pressed');
    setSelectedIndex(index);
    setModalPlayerVisible(!modalPlayerVisible);
  };

  useEffect(() => {
    getDarkOrLightMode();
    getAboutUsList();
  }, [isFocused]);

  //useEffect(() => {}); // this will run on every render

  function saveComplete() {
    console.log('Save Complete');
  }

  function getAboutUsList() {
    setIsLoading(true);
    getMedia('moreLinks')
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
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
              {data.map((item, index) => (
                <AboutUsRow key={index} data={item} onPress={() => handleRowPress(index)} />
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
