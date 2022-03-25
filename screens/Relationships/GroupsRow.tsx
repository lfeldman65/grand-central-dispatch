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
import { GroupsDataProps } from './interfaces';
const chevron = require('../../images/chevron_blue_right.png');

interface GroupsRowProps {
  data: GroupsDataProps;
  onPress(): void;
}

export default function GroupsRow(props: GroupsRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.groupRow}>
        <Text style={styles.personName}>{props.data.groupName + ' (' + props.data.groupSizeLabel + ')'}</Text>
        <Image source={chevron} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}
