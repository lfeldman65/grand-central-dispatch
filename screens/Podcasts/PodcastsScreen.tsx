import { useState } from 'react';
import { View, Modal, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');

const appleImage = require('../Podcasts/images/applePodcast.png');
const amazonImage = require('../Podcasts/images/amazonPodcast.png');
const spotifyImage = require('../Podcasts/images/spotifyPodcast.png');
const stitcherImage = require('../Podcasts/images/stitcherPodcast.png');

export default function PodcastsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [lightOrDark, setLightOrDark] = useState('');
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  //  Linking.openURL('https://www.itsagoodlife.com/'); // Top level of all players

  function applePressed() {
    ga4Analytics('Podcast Player Pressed', {
      contentType: 'apple',
      itemId: 'id1401',
    });
    Linking.openURL('https://podcasts.apple.com/us/podcast/its-a-good-life/id1089027054');
  }

  function amazonPressed() {
    ga4Analytics('Podcast Player Pressed', {
      contentType: 'amazon',
      itemId: 'id1401',
    });
    Linking.openURL("https://music.amazon.com/podcasts/ce6952cd-7c2b-4953-96fa-648e076e301f/it's-a-good-life");
  }

  function spotifyPressed() {
    ga4Analytics('Podcast Player Pressed', {
      contentType: 'spotify',
      itemId: 'id1401',
    });
    Linking.openURL(
      'https://open.spotify.com/show/5t4rlBQz31cXiYeyirtMJC?si=ca802c6e46e74f9e&nd=1&dlsi=0127ee107d2e4572'
    );
  }

  function stitchPressed() {
    ga4Analytics('Podcast Player Pressed', {
      contentType: 'stitcher',
      itemId: 'id1401',
    });
    Linking.openURL('https://www.pandora.com/podcast/its-a-good-life/PC:32075?source=stitcher-sunset');
  }

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
  } // command /

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      {/* <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}> */}
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={applePressed}>
              <Image source={appleImage} style={styles.logo} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={amazonPressed}>
              <Image source={amazonImage} style={styles.logo} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={spotifyPressed}>
              <Image source={spotifyImage} style={styles.logo} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.pair}>
            <TouchableOpacity onPress={stitchPressed}>
              <Image source={stitcherImage} style={styles.logo} />
            </TouchableOpacity>
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A6295',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  pair: {
    flex: 1,
    marginTop: 20,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 54,
    marginBottom: 5,
  },
});
