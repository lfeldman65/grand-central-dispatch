import { Text, View, TouchableOpacity, Linking, Modal, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { styles } from './styles';
import { saveAsFavorite } from './api';
import openMap from 'react-native-open-maps';
import { useNavigation } from '@react-navigation/native';
import { PACDataProps } from './interfaces';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import PacComplete from './PACCompleteScreen';
import { postponeAction, completeAction } from './postponeAndComplete';
import { handleTextPressed, ga4Analytics } from '../../utils/general';
import globalStyles from '../../globalStyles';
import { mobileTypeMenu, relSheets } from '../Relationships/relationshipHelpers';
import { storage } from '../../utils/storage';
import { useActionSheet } from '@expo/react-native-action-sheet';

interface PACRowProps {
  key: number;
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
  close(s: Swipeable): void;
}

export default function PACPopRow(props: PACRowProps) {
  const [saveShown, setSaveShown] = useState(!props.data.isFavorite);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [relLat, setRelLat] = useState('33.17');
  var _swipeableRow: Swipeable;
  const { showActionSheetWithOptions } = useActionSheet();

  async function completePressed() {
    ga4Analytics('PAC_Swipe_Complete', {
      contentType: 'Pop_Bys',
      itemId: 'id0416',
    });
    setModalVisible(true);
  }

  function saveComplete(note: string) {
    console.log('Note ', note);
    completeAction(props.data.contactId, props.data.type, note, completeSuccess, completeFailure);
  }

  async function postponePressed(contactID: string, type: string) {
    ga4Analytics('PAC_Swipe_Postpone', {
      contentType: 'Pop_Bys',
      itemId: 'id0415',
    });
    setIsLoading(true);
    postponeAction(contactID, type, postponeSuccess, postponeFailure);
  }

  function postponeSuccess() {
    console.log('postpone success');
    setIsLoading(false);
    props.refresh();
  }

  function postponeFailure() {
    setIsLoading(false);
    console.log('postpone failure');
  }

  function completeSuccess() {
    setIsLoading(false);
    props.refresh();
  }

  function completeFailure() {
    setIsLoading(false);
    console.log('complete failure');
  }

  const handleMobilePressed = () => {
    const options = mobileTypeMenu;
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex != cancelButtonIndex) {
          if (selectedIndex == 0) {
            ga4Analytics('PAC_Mobile_Call', {
              contentType: 'Pop_By_Tab',
              itemId: 'id0408',
            });
            Linking.openURL(`tel:${props.data.mobilePhone}`);
          } else {
            ga4Analytics('PAC_Mobile_Text', {
              contentType: 'Pop_By_Tab',
              itemId: 'id0409',
            });
            handleTextPressed(props.data.mobilePhone);
          }
        }
      }
    );
  };

  function handleHomePressed() {
    ga4Analytics('PAC_Home_Call', {
      contentType: 'Pop_By_Tab',
      itemId: 'id0410',
    });
    Linking.openURL(`tel:${props.data.homePhone}`);
  }

  function handleOfficePressed() {
    ga4Analytics('PAC_Office_Call', {
      contentType: 'Pop_By_Tab',
      itemId: 'id0411',
    });
    Linking.openURL(`tel:${props.data.officePhone}`);
  }

  useEffect(() => {}, [navigation, relLat]);

  useEffect(() => {
    titleForSaveButton();
  }, [saveShown]);

  useEffect(() => {
    styleForSaveButton;
  }, [saveShown]);

  function titleForSaveButton() {
    if (saveShown) {
      return 'Save to Map';
    }
    return 'Saved';
  }

  function handleDirectionsPressed() {
    ga4Analytics('PAC_Directions', {
      contentType: 'Pop_Bys',
      itemId: 'id0412',
    });
    //   openMap({ latitude: 33.1175, longitude: -117.0722, zoom: 10 });
    //   openMap({ query: '7743 Royal Park Dr. Lewis Center OH 43035' });
    openMap({ query: completeAddress() });
  }

  function completeAddress() {
    var addressString = '';
    if (props.data.street1 != null) {
      addressString = addressString + ' ' + props.data.street1;
    }
    if (props.data.street2 != null) {
      addressString = addressString + ' ' + props.data.street2;
    }
    if (props.data.city != null) {
      addressString = addressString + ' ' + props.data.city;
    }
    if (props.data.state != null) {
      addressString = addressString + ' ' + props.data.state;
    }
    if (props.data.zip != null) {
      addressString = addressString + ' ' + props.data.zip;
    }
    return addressString;
  }

  function handleSavePressed() {
    if (saveShown) {
      ga4Analytics('PAC_Save_To_Map', {
        contentType: 'none',
        itemId: 'id0413',
      });
      saveAsFavoriteAPI();
      setSaveShown(!saveShown);
    } else {
      console.log('hey dude');
    }
  }

  function styleForSaveButton() {
    if (saveShown) {
      return {
        color: '#02ABF7',
        fontSize: 15,
        textAlign: 'right',
        marginRight: 10,
        marginTop: -3,
      };
    }
    return {
      color: 'gray',
      fontSize: 15,
      textAlign: 'right',
      marginRight: 10,
      marginTop: -3,
    };
  }

  function delayedAction() {
    navigation.navigate('PopBysScreen');
  }

  function handlePopPressed() {
    ga4Analytics('PAC_Pop_By_Map', {
      contentType: 'none',
      itemId: 'id0414',
    });
    storage.setItem('pacLat', '33.221241');
    storage.setItem('pacLong', '-117.255745');
    storage.setItem('pacName', props.data.contactName);
    setTimeout(delayedAction, 1000);
  }

  function saveAsFavoriteAPI() {
    setIsLoading(true);
    saveAsFavorite(props.data.contactId)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log('here');
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function handleSwipeBegin(rowKey: number) {
    console.log('handle swipe');
    props.close(_swipeableRow);
    props.data.swipeRef = _swipeableRow;
  }

  function handleSwipeEnd() {
    console.log('swipe end');
    props.data.swipeRef = null;
  }

  function updateRef(ref: Swipeable) {
    _swipeableRow = ref;
  }

  function lastPopText(lastText: string) {
    // console.log('last text: ' + lastText);
    if (lastText == 'No PopBy') return 'Last Pop-By: No Pop-By';
    return 'Last Pop-By: ' + lastText;
  }

  const renderRightActions = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <TouchableOpacity
          style={styles.postponeButtonTouch}
          onPress={() => {
            completePressed();
          }}
        >
          <Text style={styles.postponeButton}>Complete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <TouchableOpacity
          style={styles.postponeButtonTouch}
          onPress={() => {
            postponePressed(props.data.contactId, props.data.type);
          }}
        >
          <Text style={styles.postponeButton}>Postpone</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={updateRef}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableWillOpen={() => handleSwipeBegin(props.key)}
      onSwipeableWillClose={handleSwipeEnd}
      friction={2}
    >
      <TouchableOpacity onPress={props.onPress}>
        <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <View style={styles.popbyRow}>
            <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {props.data.contactName}
            </Text>
            {props.data.street1 != null && (
              <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed()}>
                <Text style={styles.popByButtons}>{'Directions'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.popbyRow}>
            <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
              {'Ranking: ' + props.data.ranking}
            </Text>
            {props.data.street1 && (
              <TouchableOpacity style={styles.popByButtons} onPress={() => handleSavePressed()}>
                <Text style={saveShown ? styles.saveToMapButton : styles.savedButton}>{titleForSaveButton()}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.popbyRow}>
            <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
              {lastPopText(props.data.lastPopByDate)}
            </Text>
            {props.data.longitude != null && (
              <TouchableOpacity style={styles.popByButtons} onPress={() => handlePopPressed()}>
                <Text style={styles.popByButtons}>{'Pop-By Map'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {props.data.street1 != null && (
            <Text style={props.lightOrDark == 'dark' ? styles.streetTextDark : styles.streetTextLight}>
              {props.data.street1}
            </Text>
          )}
          {props.data.street2 != null && (
            <Text style={props.lightOrDark == 'dark' ? styles.streetTextDark : styles.streetTextLight}>
              {props.data.street2}
            </Text>
          )}
          {props.data.city != null && (
            <Text style={props.lightOrDark == 'dark' ? styles.cityStateZipTextDark : styles.cityStateZipTextLight}>
              {props.data.city + ' ' + props.data.state + ' ' + props.data.zip}
            </Text>
          )}
          {props.data.mobilePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleMobilePressed()}>
              <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobilePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.officePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleOfficePressed()}>
              <Text style={styles.phoneNumber}>{'Office: ' + props.data.officePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.homePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handleHomePressed()}>
              <Text style={styles.phoneNumber}>{'Home: ' + props.data.homePhone}</Text>
            </TouchableOpacity>
          )}

          {modalVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <PacComplete
                contactName={props.data.contactName}
                onSave={saveComplete}
                setModalVisible={setModalVisible}
                type={'popbys'}
              />
            </Modal>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
