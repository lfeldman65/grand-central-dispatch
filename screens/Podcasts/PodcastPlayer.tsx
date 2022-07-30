import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { PlayerStatus, PodcastDataProps } from './interfaces';

import { useNavigation, useIsFocused } from '@react-navigation/native';
const backArrow = require('../../images/white_arrow_left.png');
const logo = require('../Podcasts/images/podcastLarge.png');
const play = require('../Podcasts/images/audio_play.png');
const pause = require('../Podcasts/images/audio_pause.png');

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default function PodcastPlayer(props: any) {
  const { setModalPlayerVisible, dataList, selectedIndex } = props;
  const [podcastItem, setPodcastItem] = useState<PodcastDataProps>(dataList[selectedIndex]);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: true,
    isPlaying: false,
    isBuffering: true,
    muted: false,
  });
  const isFocused = useIsFocused();

  function getSeasonAndEpisode(longTitle: string) {
    const sectionsArray = longTitle.split(':'); // 0: It's a good life, 1: S2E53, 2: Title
    const seasonAndEpisode = sectionsArray[1]; // S2E53
    const seasonAndEpiodeArray = seasonAndEpisode.split('E'); // 0: S2, 1: 53
    const seasonUgly = seasonAndEpiodeArray[0]; // S2
    const seasonArray = seasonUgly.split('S'); // 0: empty, 1: 2
    const seasonOnly = seasonArray[1]; // 2
    const episodeOnly = seasonAndEpiodeArray[1];
    return 'Season ' + seasonOnly + ' Episode ' + episodeOnly;
  }

  function prettyPodcastName(longTitle: string) {
    const sectionsArray = longTitle.split(':'); // 0: It's a good life, 1: S2E53, 2: Title
    return sectionsArray[2];
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      //console.log("volume " + status.volume);
      setPlayerStatus({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: false,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        muted: status.isMuted,
        volume: status.volume,
      });
      if (status.didJustFinish && !status.isLooping) {
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  }

  function cancelPressed() {
    setModalPlayerVisible(false);
  }

  async function playPausePressed() {
    console.log('play/pause pressed');
    if (sound != null) (await playerStatus.isPlaying) ? sound.pauseAsync() : sound.playAsync();
  }

  async function playSound() {
    const source = { uri: podcastItem.url };

    const initialStatus = {
      shouldPlay: true,
      //rate: this.state.rate,
      //shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: playerStatus.volume ?? 1,
      //isMuted: playerStatus.muted,
      //isLooping: this.state.loopingType === LOOPING_TYPE_ONE
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const { sound } = await Audio.Sound.createAsync(source, initialStatus, onPlaybackStatusUpdate);
    setSound(sound);

    // console.log('Playing Sound');
    setIsLoading(false);
    await sound.playAsync();
  }

  useEffect(() => {
    playSound();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.setOnPlaybackStatusUpdate(null);
          //unload for now - we will want it to continue playing later
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={backArrow} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{getSeasonAndEpisode(podcastItem.title)}</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      {/* <Image source={{uri:podcastItem.imageUrl}} style={styles.logoImage} /> */}
      <Image source={logo} style={styles.logoImage} />

      <Text style={styles.podcastName}>{prettyPodcastName(podcastItem.title)}</Text>

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={playPausePressed}>
          <Image source={playerStatus.isPlaying ? pause : play} style={styles.controlsImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#004F89',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backArrow: {
    width: 17,
    height: 14,
    marginLeft: 7,
    marginTop: 20, // alignment varies by device, so need a better way
  },
  pageTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 20, // alignment varies by device, so need a better way
    textAlign: 'center',
  },
  podcastName: {
    color: 'white',
    fontSize: 14,
    margin: 10,
    textAlign: 'center',
  },
  blankButton: {
    // Helps placement of arrow and title (there's probably a better way to do this)
    width: 30,
  },
  logoImage: {
    marginTop: '5%',
    alignSelf: 'center',
    height: 200,
    width: 200,
  },
  controlsView: {
    flexDirection: 'row',
    marginTop: 20,
    height: 80,
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  controlsImage: {
    height: 50,
    width: 50,
  },
});
