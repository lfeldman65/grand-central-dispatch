import { Text, View, Image, TouchableOpacity, StyleSheet, Modal, Alert, Linking } from 'react-native';
import { PopByRadiusDataProps, PopByFavoriteDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { removePop, completePop } from './api';
import openMap from 'react-native-open-maps';
import PopComplete from './PopCompleteScreen';
import { ga4Analytics } from '../../utils/general';

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
      <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <View style={styles.rankBox}>
          <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
        </View>
        <View style={props.lightOrDark == 'dark' ? styles.textBoxDark : styles.textBoxLight}>
          <Text style={props.lightOrDark == 'dark' ? styles.nameTextDark : styles.nameTextLight}>
            {props.data.firstName + ' ' + props.data.lastName}
          </Text>
          <Text
            style={props.data.mobile == '' ? styles.noPhoneText : styles.phoneText}
            onPress={() => handlePhonePressed(props.data.mobile)}
          >
            {props.data.mobile == '' ? 'No phone' : props.data.mobile}
          </Text>
          <View style={styles.buttonRow}>
            <Text style={styles.directionsAndCompleteText} onPress={() => handleDirectionsPressed()}>
              Directions
            </Text>
            <Text style={styles.directionsAndCompleteText} onPress={() => handleCompletePressed()}>
              Complete
            </Text>
            <Text style={styles.removeText} onPress={() => handleRemovePressed()}>
              Remove
            </Text>
          </View>
        </View>
        <View style={styles.chevronBox}>
          <Text style={props.lightOrDark == 'dark' ? styles.distanceTextDark : styles.distanceTextLight}>
            {props.data.distance + ' ' + 'miles   '}
          </Text>
          <Image source={chevron} style={styles.chevron} />
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

export const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    height: 120,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    height: 120,
  },
  rankBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    width: '15%',
  },
  rankingCircle: {
    height: 30,
    width: 30,
  },
  textBoxDark: {
    flexDirection: 'column',
    height: 80,
    backgroundColor: 'black',
    width: '55%',
    marginLeft: 5,
    textAlign: 'left',
  },
  textBoxLight: {
    flexDirection: 'column',
    height: 80,
    backgroundColor: 'white',
    width: '55%',
    marginLeft: 5,
    textAlign: 'left',
  },
  nameTextDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
  },
  nameTextLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
  },
  distanceTextDark: {
    color: 'white',
    fontSize: 16,
    marginTop: 9,
  },
  distanceTextLight: {
    color: 'black',
    fontSize: 16,
    marginTop: 9,
  },
  phoneText: {
    color: '#1398F5',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 15,
  },
  noPhoneText: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 7,
  },
  directionsAndCompleteText: {
    color: '#1398F5',
    fontSize: 18,
    textAlign: 'left',
    marginRight: 20,
  },
  saveText: {
    color: '#1398F5',
    fontSize: 18,
    textAlign: 'left',
    marginRight: 20,
  },
  savedText: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'left',
    marginRight: 20,
  },
  removeText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'left',
  },
  chevronBox: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 15,
    width: '30%',
  },
  chevron: {
    height: 20,
    width: 12,
    marginTop: 9,
  },
});
