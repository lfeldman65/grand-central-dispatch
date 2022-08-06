import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { PlayerStatus, PodcastDataProps } from './interfaces';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { printWidth } from '../../prettier.config';
const backArrow = require('../../images/white_arrow_left.png');
const logo = require('../Podcasts/images/podcastLarge.png');
const back = require('../Podcasts/images/audio_back.png');
const backDisabled = require('../Podcasts/images/audio_pause.png');
const next = require('../Podcasts/images/audio_next.png');
const nextDisabled = require('../Podcasts/images/audio_pause.png');
const play = require('../Podcasts/images/audio_play.png');
const pause = require('../Podcasts/images/audio_pause.png');
const speakerOff = require('../Podcasts/images/volumeDown.png');
const speakerOn = require('../Podcasts/images/volumeUp.png');

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default function PodcastPlayer(props: any) {
  const { setModalPlayerVisible, dataList, selectedIndex } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [podcastItem, setPodcastItem] = useState<PodcastDataProps>(dataList[selectedIndex]);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  //var isMounted = false;

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
  const isFocused = useIsFocused();

  function getSeekSliderPosition() {
    // console.log('getSeekSliderPosition');
    return 0;
  }

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

  function getTimeStamp() {
    return 'time stamp';
  }

  function onVolumeSliderValueChange(value: any) {
    console.log('onVolumeSliderChange');
  }

  function getDurationTimeStamp() {
    return 'duration stamp';
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

  function onSeekSliderValueChange(value: number) {
    console.log('onSeekSliderValueChange');
  }

  async function onSeekSliderSlidingComplete(value: number) {
    console.log('onSeekSliderSlidingComplete');
  }

  async function backPressed() {
    console.log('back pressed current index: ' + currentIndex);
    if (currentIndex < dataList.length - 1) {
      setIsLoading(true);
      if (sound != null) {
        sound.setOnPlaybackStatusUpdate(null);
        setPlayerStatus({
          playbackInstancePosition: null,
          playbackInstanceDuration: null,
          shouldPlay: true,
          isPlaying: false,
          isBuffering: true,
          muted: playerStatus.muted,
          volume: playerStatus.volume,
        });
        await sound.unloadAsync();
      }
      setPodcastItem(dataList[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
      playSound();
    }
  }

  async function nextPressed() {
    console.log('next pressed current index: ' + currentIndex);
    if (currentIndex > 0) {
      setIsLoading(true);
      if (sound != null) {
        sound.setOnPlaybackStatusUpdate(null);
        setPlayerStatus({
          playbackInstancePosition: null,
          playbackInstanceDuration: null,
          shouldPlay: true,
          isPlaying: false,
          isBuffering: true,
          muted: playerStatus.muted,
          volume: playerStatus.volume,
        });
        await sound.unloadAsync();
      }
      setPodcastItem(dataList[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
      playSound();
    }
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
      <View style={styles.scrubber}>
        <Slider
          minimumTrackTintColor="#ffffff"
          maximumTrackTintColor="#ffffff"
          thumbTintColor="#00ee44"
          disabled={isLoading}
          value={getSeekSliderPosition()}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
        />
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.startTime}>{getTimeStamp()}</Text>
        <Text style={styles.buffering}>{playerStatus.isBuffering ? 'Buffering...' : ''}</Text>
        <Text style={styles.duration}>{getDurationTimeStamp()}</Text>
      </View>

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={backPressed}>
          <Image
            source={currentIndex == dataList.length - 1 || playerStatus.isBuffering ? backDisabled : back}
            style={styles.controlsImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPausePressed}>
          <Image source={playerStatus.isPlaying ? pause : play} style={styles.controlsImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={nextPressed}>
          <Image
            source={currentIndex == 0 || playerStatus.isBuffering ? nextDisabled : next}
            style={styles.controlsImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <Image source={speakerOff} style={styles.speakerImage} />

        <Slider
          style={styles.volumeSlider}
          minimumTrackTintColor="#ffffff"
          maximumTrackTintColor="#ffffff"
          thumbTintColor="#00ee44"
          disabled={isLoading}
          value={playerStatus.volume ?? 0}
          onValueChange={onVolumeSliderValueChange}
        />
        <Image source={speakerOn} style={styles.speakerImage} />
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
    marginTop: 16, // alignment varies by device, so need a better way
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
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 15,
  },
  buffering: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  startTime: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 10,
  },
  duration: {
    color: 'white',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
  },
  controlsImage: {
    height: 50,
    width: 50,
  },
  volumeView: {
    flexDirection: 'row',
    height: 80,
    width: '85%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    width: '85%',
    alignSelf: 'center',
  },
  speakerImage: {
    height: 20,
    width: 20,
  },
  scrubber: {
    height: 20,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 10,
  },
  volumeSlider: {
    width: '80%',
  },
});
