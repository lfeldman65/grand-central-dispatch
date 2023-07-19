import { Text, View, Image, TouchableOpacity, StyleSheet, Modal, Alert, Linking } from 'react-native';
import { PopByRadiusDataProps, PopByFavoriteDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { removePop, completePop } from './api';
import openMap from 'react-native-open-maps';
import PopComplete from './PopCompleteScreen';
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
  refresh(): void;
  lightOrDark: string;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  if (rank == 'C') return rankC;
  return rankD;
}

export default function PopByRowSaved(props: PopBysRowProps) {
  const { popByTab } = props;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState('False');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setIsFavorite(props.data.address.isFavorite);
  }, [isFocused]);

  function handleDirectionsPressed() {
    ga4Analytics('PopBy_Directions', {
      contentType: popByTab,
      itemId: 'id1109',
    });
    openMap({ query: completeAddress() });
  }

  function completePressed(note: string) {
    console.log('Note ', note);
    completeAction(props.data.id, 'popby', note, completeSuccess, completeFailure);
  }

  function completeSuccess() {
    setIsLoading(false);
    props.refresh();
  }

  function completeFailure() {
    setIsLoading(false);
    console.log('complete failure');
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

  function handleCompletePressed() {
    setModalVisible(true);
  }

  function completeAction(contactId: string, type: string, note: string, onSuccess: any, onFailure: any) {
    completePop(contactId, type, note)
      .then((res) => {
        console.log(res);
        if (res.status == 'error') {
          console.error(res.error);
          onFailure();
        } else {
          setModalVisible(false);
          ga4Analytics('PopBy_Complete', {
            contentType: 'none',
            itemId: 'id1111',
          });
          onSuccess();
        }
      })
      .catch((error) => {
        onFailure();
        console.log('complete error' + error);
      });
  }

  function handleRemovePressed() {
    console.log('remove pressed');
    Alert.alert(
      'Remove ' + props.data.firstName + ' from Saved map?',
      '',
      [
        {
          text: 'Remove',
          onPress: () => removePressedContinue(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function removePressedContinue() {
    ga4Analytics('PopBy_Remove', {
      contentType: 'none',
      itemId: 'id1112',
    });
    removePop(props.data.id);
    props.refresh();
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
            <Text style={stylesPop.directionsAndCompleteText} onPress={() => handleDirectionsPressed()}>
              Directions
            </Text>
            <Text style={stylesPop.directionsAndCompleteText} onPress={() => handleCompletePressed()}>
              Track
            </Text>
            <Text style={stylesPop.removeText} onPress={() => handleRemovePressed()}>
              Remove
            </Text>
          </View>
        </View>
        <View style={stylesPop.chevronBox}>
          <Text style={props.lightOrDark == 'dark' ? stylesPop.distanceTextDark : stylesPop.distanceTextLight}>
            {props.data.distance + ' ' + 'miles   '}
          </Text>
        </View>
        {modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <PopComplete contactName={'Complete Pop-By'} onSave={completePressed} setModalVisible={setModalVisible} />
          </Modal>
        )}
      </View>
    </TouchableOpacity>
  );
}
