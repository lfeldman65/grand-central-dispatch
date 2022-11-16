import { useState } from 'react';
import { StyleSheet, View, Modal, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { getPodcastData } from './api';
import { PodcastDataProps } from './interfaces';
import { analytics } from '../../utils/analytics';
import React from 'react';
import PodcastsRow from './PodcastsRow';
import PodcastPlayer from './PodcastPlayer';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

export default function PodcastsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [data, setData] = useState<PodcastDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [modalPlayerVisible, setModalPlayerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleRowPress = (index: number) => {
    analytics.event(new Event('Video Summary', 'Row', 'Press', 0));
    console.log('Row Pressed');
    setSelectedIndex(index);
    setModalPlayerVisible(!modalPlayerVisible);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getPodcastList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function getPodcastList(isMounted: boolean) {
    setIsLoading(true);
    console.log('yep');
    getPodcastData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
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
                {data.map((item, index) => (
                  <PodcastsRow
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            </ScrollView>
          </React.Fragment>
        )}
        {modalPlayerVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalPlayerVisible}
            onRequestClose={() => {
              setModalPlayerVisible(!modalPlayerVisible);
            }}
          >
            <PodcastPlayer
              selectedIndex={selectedIndex}
              dataList={data}
              setModalPlayerVisible={setModalPlayerVisible}
            />
          </Modal>
        )}
      </View>
    </>
  );
}
