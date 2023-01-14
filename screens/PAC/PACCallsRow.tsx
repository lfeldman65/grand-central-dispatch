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
import { handleTextPressed } from '../../utils/general';

interface PACCallsRowProps {
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
}

export default function PACCallsRow(props: PACCallsRowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
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
    console.log('mobile pressed');
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
