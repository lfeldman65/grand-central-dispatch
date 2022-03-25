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
  relFromAbove: string;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  return rankC;
}

function displayName(first: string, last: string, type: string, employer: string, isAZ: boolean) {
  if (type == 'Rel') {
    return first + ' ' + last;
  }
  return employer + ' (' + first + ')';
}

export default function RankingRow(props: AtoZRowProps) {
  const { relFromAbove } = props;
  return (
    <TouchableOpacity onPress={props.onPress}>
      {props.data.contactTypeID == relFromAbove && (
        <View style={styles.row}>
          <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
          {relFromAbove == 'Rel' && (
            <Text style={styles.personName}>
              {displayName(
                props.data.firstName,
                props.data.lastName,
                props.data.contactTypeID,
                props.data.employerName,
                true
              )}
            </Text>
          )}
          {relFromAbove == 'Biz' && (
            <Text style={styles.personName}>
              {displayName(
                props.data.firstName,
                props.data.lastName,
                props.data.contactTypeID,
                props.data.employerName,
                true
              )}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
