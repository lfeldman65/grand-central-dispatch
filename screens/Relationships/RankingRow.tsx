import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
import styles from './styles';
import { analytics } from '../../utils/analytics';
import { RolodexDataProps } from './interfaces';
const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankAPlus.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');

interface AtoZRowProps {
  data: RolodexDataProps;
  onPress(): void;
}

function chooseImage(rank: string) {
  console.log(rank);
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  return rankC;
}

export default function RankingRow(props: AtoZRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
        <Text style={styles.personName}>{props.data.firstName + ' ' + props.data.lastName}</Text>
      </View>
    </TouchableOpacity>
  );
}
