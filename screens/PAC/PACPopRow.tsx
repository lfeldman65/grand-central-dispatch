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
import { handleTextPressed } from '../../utils/general';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { mobileTypeMenu, Sheets } from '../Relationships/relationshipHelpers';

interface PACRowProps {
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
}

export default function PACPopRow(props: PACRowProps) {
  const [saveShown, setSaveShown] = useState(!props.data.isFavorite);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const actionSheetRef = useRef<ActionSheet>(null);

  async function completePressed() {
    console.log('complete pressed');
    setModalVisible(true);
  }

  function saveComplete(note: string) {
    console.log('Note ', note);
    completeAction(props.data.contactId, props.data.type, note, completeSuccess, completeFailure);
  }

  async function postponePressed(contactID: string, type: string) {
    console.log('postpone pressed');
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

  function handleMobilePressed() {
    console.log('mobile pressed here');
    SheetManager.show(Sheets.mobileSheet);
  }

  function handleHomePressed() {
    console.log('home pressed');
    Linking.openURL(`tel:${props.data.homePhone}`);
  }

  function handleOfficePressed() {
    console.log('office pressed');
    Linking.openURL(`tel:${props.data.officePhone}`);
  }

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

  function handlePopPressed() {
    console.log('pop');
    navigation.navigate('PopBysScreen');
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
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
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
              {'Last Pop-By: ' + props.data.lastPopByDate}
            </Text>
            {props.data.street1 && (
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

          <ActionSheet
            initialOffsetFromBottom={10}
            onBeforeShow={(data) => console.log('mobile call type sheet')}
            id={Sheets.mobileSheet}
            ref={actionSheetRef}
            statusBarTranslucent
            bounceOnOpen={true}
            drawUnderStatusBar={true}
            bounciness={4}
            gestureEnabled={true}
            bottomOffset={40}
            defaultOverlayOpacity={0.3}
          >
            <View
              style={{
                paddingHorizontal: 12,
              }}
            >
              <ScrollView
                nestedScrollEnabled
                onMomentumScrollEnd={() => {
                  actionSheetRef.current?.handleChildScrollEnd();
                }}
                style={styles.scrollview}
              >
                <View>
                  {Object.entries(mobileTypeMenu).map(([index, value]) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        SheetManager.hide(Sheets.mobileSheet, null).then(() => {
                          console.log('CALLTYPE1: ' + props.data.mobilePhone);
                          if (value == 'Call') {
                            Linking.openURL(`tel:${props.data.mobilePhone}`);
                          } else {
                            handleTextPressed(props.data.mobilePhone);
                          }
                        });
                      }}
                      style={globalStyles.listItemCell}
                    >
                      <Text style={globalStyles.listItem}>{index}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ActionSheet>

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
              />
            </Modal>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
