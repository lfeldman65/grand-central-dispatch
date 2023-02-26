import { useState } from 'react';
import { View, Modal, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { getPodcastData } from './api';
import { PodcastDataProps } from './interfaces';
import React from 'react';
import PodcastsRow from './PodcastsRow';
import PodcastPlayer from './PodcastPlayer';
import globalStyles from '../../globalStyles';
import { getSeasonAndEpisode } from './PodcastPlayer';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

export default function PodcastsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [data, setData] = useState<PodcastDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const [modalPlayerVisible, setModalPlayerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  const handleRowPress = (index: number) => {
    ga4Analytics('Podcast_Row', {
      contentType: getSeasonAndEpisode(data[index].title),
      itemId: 'id1401',
    });
    setSelectedIndex(index);
    setModalPlayerVisible(!modalPlayerVisible);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    getPodcastList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  }

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
        {quickSearchVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={quickSearchVisible}
            onRequestClose={() => {
              setQuickSearchVisible(!quickSearchVisible);
            }}
          >
            <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
          </Modal>
        )}
      </View>
    </>
  );
}
