import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { PlayerStatus, PodcastDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';
import { ga4Analytics } from '../../utils/general';
import { useContext } from 'react';
import AppContext from './../../components/AppContext';

const backChevron = require('../../images/chevron_white_left.png');
const logo = require('../Podcasts/images/podcastLarge.png');
const back = require('../Podcasts/images/audio_back.png');
const next = require('../Podcasts/images/audio_next.png');
const blank = require('../Podcasts/images/audio_blank.png');

const play = require('../Podcasts/images/audio_play.png');
const pause = require('../Podcasts/images/audio_pause.png');
const speakerOff = require('../Podcasts/images/volumeDown.png');
const speakerOn = require('../Podcasts/images/volumeUp.png');

export function getSeasonAndEpisode(longTitle: string) {
  const sectionsArray = longTitle.split(':'); // 0: It's a good life, 1: S2E53, 2: Title
  const seasonAndEpisode = sectionsArray[1]; // S2E53
  const seasonAndEpiodeArray = seasonAndEpisode.split('E'); // 0: S2, 1: 53
  const seasonUgly = seasonAndEpiodeArray[0]; // S2
  const seasonArray = seasonUgly.split('S'); // 0: empty, 1: 2
  const seasonOnly = seasonArray[1]; // 2
  const episodeOnly = seasonAndEpiodeArray[1];
  return 'Season ' + seasonOnly + ' Episode ' + episodeOnly;
}
export default function PodcastPlayer(props: any) {
  const { setModalPlayerVisible, dataList, selectedIndex } = props;
  const [podcastItem, setPodcastItem] = useState<PodcastDataProps>(dataList[selectedIndex]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(selectedIndex);
  const [currentPosition, setCurrentPosition] = useState(0.0);

  //const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  //const [sound, setSound] = useState<Audio.Sound>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isVolumeSeeking, setIsVolumeSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  const myContext = useContext(AppContext);

  /*
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: true,
    isPlaying: false,
    isBuffering: true,
    muted: false,
    //isLoading: true,
    //isSeeking: false
  });*/

  const isFocused = useIsFocused();

  function getSeekSliderPosition() {
    if (
      myContext.sound != null &&
      myContext.playerStatus.playbackInstancePosition != null &&
      myContext.playerStatus.playbackInstanceDuration != null
    ) {
      var pos = myContext.playerStatus.playbackInstancePosition / myContext.playerStatus.playbackInstanceDuration;

      //console.log(pos);
      return pos;
    }
    return 0;
  }

  function getMMSSFromMillis(millis: number) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (num: any) => {
      const string = num.toString();
      if (num < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  function prettyPodcastName(longTitle: string) {
    const sectionsArray = longTitle.split(':'); // 0: It's a good life, 1: S2E53, 2: Title
    return sectionsArray[2];
  }

  function getTimeStamp() {
    if (
      myContext.sound != null &&
      myContext.playerStatus.playbackInstancePosition != null &&
      myContext.playerStatus.playbackInstanceDuration != null
    ) {
      //console.log(myContext.playerStatus.playbackInstancePosition);
      return `${getMMSSFromMillis(currentPosition)}`;
    }
    return '';
  }

  async function onVolumeSliderValueChange(value: any) {
    if (myContext.sound != null) {
      if (myContext.sound != null && !isVolumeSeeking) {
        setIsVolumeSeeking(true);
        myContext.sound.setOnPlaybackStatusUpdate(null);
      }
      myContext.sound.setVolumeAsync(value);
    }
  }

  function getDurationTimeStamp() {
    if (
      myContext.sound != null &&
      myContext.playerStatus.playbackInstancePosition != null &&
      myContext.playerStatus.playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(myContext.playerStatus.playbackInstanceDuration)}`;
    }
    return '';
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      //console.log("volume " + status.volume);

      setCurrentPosition(status.positionMillis);
      myContext.setPlayerStatus({
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

  async function backPressed() {
    console.log('back pressed current index: ' + currentPodcastIndex);
    ga4Analytics('Podcast_Player_Previous', {
      contentType: 'none',
      itemId: 'id1402',
    });
    if (myContext.playerStatus.isBuffering) {
      return;
    }
    if (currentPodcastIndex < dataList.length - 1) {
      setIsLoading(true);
      if (myContext.sound != null) {
        myContext.sound.setOnPlaybackStatusUpdate(null);
        myContext.setPlayerStatus({
          playbackInstancePosition: null,
          playbackInstanceDuration: null,
          shouldPlay: true,
          isPlaying: false,
          isBuffering: true,
          muted: myContext.playerStatus.muted,
          volume: myContext.playerStatus.volume,
        });
        await myContext.sound.unloadAsync();
      }
      setPodcastItem(dataList[currentPodcastIndex + 1]);
      setCurrentPodcastIndex(currentPodcastIndex + 1);
      playSound();
    }
  }

  async function nextPressed() {
    console.log('next pressed current index: ' + currentPodcastIndex);
    ga4Analytics('Podcast_Player_Next', {
      contentType: 'none',
      itemId: 'id1403',
    });
    if (myContext.playerStatus.isBuffering) {
      return;
    }
    if (currentPodcastIndex > 0) {
      setIsLoading(true);
      if (myContext.sound != null) {
        myContext.sound.setOnPlaybackStatusUpdate(null);
        myContext.setPlayerStatus({
          playbackInstancePosition: null,
          playbackInstanceDuration: null,
          shouldPlay: true,
          isPlaying: false,
          isBuffering: true,
          muted: myContext.playerStatus.muted,
          volume: myContext.playerStatus.volume,
        });
        await myContext.sound.unloadAsync();
      }
      setPodcastItem(dataList[currentPodcastIndex - 1]);
      setCurrentPodcastIndex(currentPodcastIndex - 1);
      playSound();
    }
  }

  function onSeekSliderValueChange(value: number) {
    if (myContext.sound != null && !isSeeking) {
      setIsSeeking(true);
      setShouldPlayAtEndOfSeek(myContext.playerStatus.isPlaying!);
      myContext.sound.setOnPlaybackStatusUpdate(null);
      myContext.sound.pauseAsync();
    }

    if (myContext.playerStatus.playbackInstanceDuration != null)
      setCurrentPosition(value * myContext.playerStatus.playbackInstanceDuration);
    /*
    myContext.setPlayerStatus({
      playbackInstancePosition: value * myContext.playerStatus.playbackInstanceDuration,
      playbackInstanceDuration: myContext.playerStatus.playbackInstanceDuration,
      shouldPlay: myContext.playerStatus.shouldPlay,
      isPlaying: myContext.playerStatus.isPlaying,
      isBuffering: myContext.playerStatus.isBuffering,
      muted: myContext.playerStatus.muted,
      volume: myContext.playerStatus.volume,
    });*/

    //playerStatus.playbackInstancePosition = value * playerStatus.playbackInstanceDuration;
  }

  async function onVolumeSliderSlidingComplete(value: number) {
    if (myContext.sound != null) {
      ga4Analytics('Podcast_Player_Volume', {
        contentType: 'none',
        itemId: 'id1407',
      });
    }

    setIsVolumeSeeking(false);
    myContext.sound?.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  }

  async function onSeekSliderSlidingComplete(value: number) {
    if (myContext.sound != null) {
      ga4Analytics('Podcast_Player_Scrubber', {
        contentType: 'none',
        itemId: 'id1406',
      });
      setIsSeeking(false);
      const seekPosition = value * myContext.playerStatus.playbackInstanceDuration;
      myContext.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      myContext.setPlayerStatus({
        playbackInstancePosition: value * myContext.playerStatus.playbackInstanceDuration,
        playbackInstanceDuration: myContext.playerStatus.playbackInstanceDuration,
        shouldPlay: myContext.playerStatus.shouldPlay,
        isPlaying: myContext.playerStatus.isPlaying,
        isBuffering: myContext.playerStatus.isBuffering,
        muted: myContext.playerStatus.muted,
        volume: myContext.playerStatus.volume,
      });

      if (shouldPlayAtEndOfSeek) {
        await myContext.sound.playFromPositionAsync(seekPosition);
      } else {
        await myContext.sound.setPositionAsync(seekPosition);
      }
    }
  }

  function playPauseButton() {
    if (myContext.playerStatus.isBuffering) {
      return blank;
    }
    if (myContext.playerStatus.isPlaying) {
      return pause;
    }
    return play;
  }

  async function playPausePressed() {
    console.log('play/pause pressed');
    if (!myContext.playerStatus.isBuffering) {
      if (myContext.playerStatus.isPlaying) {
        ga4Analytics('Podcast_Player_Pause', {
          contentType: 'none',
          itemId: 'id1404',
        });
      } else {
        ga4Analytics('Podcast_Player_Play', {
          contentType: 'none',
          itemId: 'id1405',
        });
      }
    }
    if (myContext.playerStatus.isBuffering) {
      return;
    }

    if (myContext.sound != null)
      (await myContext.playerStatus.isPlaying) ? myContext.sound.pauseAsync() : myContext.sound.playAsync();
  }

  async function playSound() {
    const source = { uri: podcastItem.url };

    const initialStatus = {
      shouldPlay: true,
      //rate: this.state.rate,
      //shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: myContext.playerStatus.volume ?? 1,
      //isMuted: playerStatus.muted,
      //isLooping: this.state.loopingType === LOOPING_TYPE_ONE
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    myContext.sound?.setOnPlaybackStatusUpdate(null);
    await myContext.sound?.unloadAsync();

    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
    const { sound } = await Audio.Sound.createAsync(source, initialStatus, onPlaybackStatusUpdate);
    myContext.setSound(sound);

    // console.log('Playing Sound');
    setIsLoading(false);

    await sound.playAsync();
    myContext.setPodcastId(podcastItem.id);
  }

  useEffect(() => {
    if (myContext.podcastId == -1) playSound();
    else {
      setIsLoading(false);
    }
  }, []);

  /*
  useEffect(() => {
    return myContext.sound
      ? () => {
          console.log('Unloading Sound');
          myContext.sound?.setOnPlaybackStatusUpdate(null);
          //unload for now - we will want it to continue playing later
          myContext.sound?.unloadAsync();
        }
      : undefined;
  }, [myContext.sound]);*/

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.backView}>
          <TouchableOpacity onPress={cancelPressed}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>{getSeasonAndEpisode(podcastItem.title)}</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      {/* <Image source={{uri:podcastItem.imageUrl}} style={styles.logoImage} /> */}
      <Image source={logo} style={styles.logoImage} />
      <View style={styles.podcastNameView}>
        <Text style={styles.podcastName}>{prettyPodcastName(podcastItem.title)}</Text>
      </View>
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
        <Text style={styles.buffering}>{myContext.playerStatus.isBuffering ? 'Loading...' : ''}</Text>
        <Text style={styles.duration}>{getDurationTimeStamp()}</Text>
      </View>

      <View style={styles.controlsView}>
        <TouchableOpacity onPress={backPressed}>
          <Image
            source={currentPodcastIndex == dataList.length - 1 || myContext.playerStatus.isBuffering ? blank : back}
            style={styles.controlsImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPausePressed}>
          <Image source={playPauseButton()} style={styles.controlsImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={nextPressed}>
          <Image
            source={currentPodcastIndex == 0 || myContext.playerStatus.isBuffering ? blank : next}
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
          value={myContext.playerStatus.volume ?? 0}
          onValueChange={onVolumeSliderValueChange}
          onSlidingComplete={onVolumeSliderSlidingComplete}
        />
        <Image source={speakerOn} style={styles.speakerImage} />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#004F89',
    flex: 1,
  },
  backView: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  backText: {
    color: 'white',
    marginLeft: 10,
    marginTop: 20,
    fontSize: 16,
  },
  topRow: {
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  backChevron: {
    width: 12,
    height: 19,
    marginLeft: 10,
    marginTop: 22, // alignment varies by device, so need a better way
  },
  pageTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 20, // alignment varies by device, so need a better way
    textAlign: 'center',
  },
  podcastNameView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  podcastName: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    width: '90%',
  },
  blankButton: {
    // Helps placement of back and title (there's probably a better way to do this)
    width: 70,
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
