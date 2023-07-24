import React from 'react';
import { Audio } from 'expo-av';
import { PlayerStatus } from '../screens/Podcasts/interfaces';

export interface GlobalStuff {
  sound: Audio.Sound | undefined | null;
  setSound(sound: Audio.Sound): void;
  podcastId: number;
  setPodcastId(index: number): void;
  playerStatus: PlayerStatus;
  setPlayerStatus(status: PlayerStatus): void;
}

const t: GlobalStuff = {
  sound: null,
  setSound: function () {},
  podcastId: 0,
  setPodcastId(index) {},
  playerStatus: {
    playbackInstancePosition: null,
    playbackInstanceDuration: null,
    shouldPlay: true,
    isPlaying: false,
    isBuffering: true,
    muted: false,
    //isLoading: true,
    //isSeeking: false
  },
  setPlayerStatus(status) {},
};

const AppContext = React.createContext<GlobalStuff>(t);

export default AppContext;
