import { Text, View, TouchableOpacity, Linking, Modal, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { styles } from './styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { PACDataProps } from './interfaces';
import PacComplete from './PACCompleteScreen';
import { postponeAction, completeAction } from './postponeAndComplete';
import { mobileTypeMenu, Sheets } from '../Relationships/relationshipHelpers';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import globalStyles from '../../globalStyles';
import { handleTextPressed, ga4Analytics } from '../../utils/general';

interface PACCallsRowProps {
  key: number;
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
  close(s: Swipeable): void;
}

export default function PACCallsRow(props: PACCallsRowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const actionSheetRef = useRef<ActionSheet>(null);
  var _swipeableRow: Swipeable;

  async function completePressed() {
    ga4Analytics('PAC_Swipe_Complete', {
      contentType: 'Calls',
      itemId: 'id0416',
    });
    setModalVisible(true);
  }

  function saveComplete(note: string) {
    console.log('318');
    console.log('Note11 ', note);
    completeAction(props.data.contactId, props.data.type, note, completeSuccess, completeFailure);
  }

  async function postponePressed(contactID: string, type: string) {
    ga4Analytics('PAC_Swipe_Postpone', {
      contentType: 'Calls',
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

  function handleMobilePressed() {
    console.log('mobile pressed');
    SheetManager.show(Sheets.mobileSheet);
  }

  function handleHomePressed() {
    ga4Analytics('PAC_Home_Call', {
      contentType: 'Calls',
      itemId: 'id0410',
    });
    Linking.openURL(`tel:${props.data.homePhone}`);
  }

  function handleOfficePressed() {
    ga4Analytics('PAC_Office_Call', {
      contentType: 'Calls',
      itemId: 'id0411',
    });
    Linking.openURL(`tel:${props.data.officePhone}`);
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
          <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
            {props.data.contactName}
          </Text>
          <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Ranking: ' + props.data.ranking}
          </Text>

          <Text style={props.lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Last Call: ' + props.data.lastCallDate}
          </Text>

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
                          console.log('CALLTYPE: ' + value);
                          if (value == 'Call') {
                            ga4Analytics('PAC_Mobile_Call', {
                              contentType: 'Calls_Tab',
                              itemId: 'id0408',
                            });
                            Linking.openURL(`tel:${props.data.mobilePhone}`);
                          } else {
                            ga4Analytics('PAC_Mobile_Text', {
                              contentType: 'Calls_Tab',
                              itemId: 'id0409',
                            });
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
                type={'calls'}
              />
            </Modal>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
