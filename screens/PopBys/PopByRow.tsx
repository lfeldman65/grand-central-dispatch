import { Text, View, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { PopByRadiusDataProps, PopByFavoriteDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { savePop, removePop } from './api';
import openMap from 'react-native-open-maps';
import { ga4Analytics } from '../../utils/general';
import { stylesPop } from './stylesPop';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');
const chevron = require('../../images/chevron_blue_right.png');

interface PopBysRowProps {
  data: PopByRadiusDataProps;
  onPress(): void;
  popByTab: string;
  lightOrDark: string;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  if (rank == 'C') return rankC;
  return rankD;
}

export default function PopByRow(props: PopBysRowProps) {
  const { popByTab } = props;
  const isFocused = useIsFocused();
  const [isFavorite, setIsFavorite] = useState('False');

  useEffect(() => {
    let isMounted = true;
    setIsFavorite(props.data.address.isFavorite);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function handleDirectionsPressed() {
    ga4Analytics('PopBy_Directions', {
      contentType: popByTab,
      itemId: 'id1109',
    });
    openMap({ query: completeAddress() });
  }

  function completeAddress() {
    var addressString = '';
    if (props.data.address.street != null) {
      addressString = addressString + ' ' + props.data.address.street;
    }
    if (props.data.address.street2 != null) {
      addressString = addressString + ' ' + props.data.address.street2;
    }
    if (props.data.address.city != null) {
      addressString = addressString + ' ' + props.data.address.city;
    }
    if (props.data.address.state != null) {
      addressString = addressString + ' ' + props.data.address.street;
    }
    if (props.data.address.street != null) {
      addressString = addressString + ' ' + props.data.address.zip;
    }
    return addressString;
  }

  function handleSaveRemovePressed() {
    ga4Analytics('PopBy_Save', {
      contentType: popByTab,
      itemId: 'id1110',
    });
    if (isFavorite == 'False') {
      savePop(props.data.id);
      setIsFavorite('True');
      Alert.alert(props.data.firstName + ' added to Saved list');
    } else {
      removePop(props.data.id);
      setIsFavorite('False');
      Alert.alert(props.data.firstName + ' removed from Saved list');
    }
  }

  function handlePhonePressed(phoneNumber: string) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? stylesPop.rowDark : stylesPop.rowLight}>
        <View style={stylesPop.rankBox}>
          <Image source={chooseImage(props.data.ranking)} style={stylesPop.rankingCircle} />
        </View>
        <View style={props.lightOrDark == 'dark' ? stylesPop.textBoxDark : stylesPop.textBoxLight}>
          <Text style={props.lightOrDark == 'dark' ? stylesPop.nameTextDark : stylesPop.nameTextLight}>
            {props.data.firstName + ' ' + props.data.lastName}
          </Text>
          <Text
            style={props.data.mobile == '' ? stylesPop.noPhoneText : stylesPop.phoneText}
            onPress={() => handlePhonePressed(props.data.mobile)}
          >
            {props.data.mobile == '' ? 'No phone' : props.data.mobile}
          </Text>
          <View style={stylesPop.buttonRow}>
            <Text style={stylesPop.buttonText} onPress={() => handleDirectionsPressed()}>
              Directions
            </Text>
            <Text
              style={isFavorite == 'True' ? stylesPop.removeText : stylesPop.saveText}
              onPress={() => handleSaveRemovePressed()}
            >
              {isFavorite == 'True' ? 'Remove' : 'Save'}
            </Text>
          </View>
        </View>
        <View style={stylesPop.chevronBox}>
          <Text style={props.lightOrDark == 'dark' ? stylesPop.distanceTextDark : stylesPop.distanceTextLight}>
            {props.data.distance + ' ' + 'miles   '}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
