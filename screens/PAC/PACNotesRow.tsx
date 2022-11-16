import { Text, View, TouchableOpacity, Modal } from 'react-native';
import { styles } from './styles';
import { PACDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { postponeAction, completeAction } from './postponeAndComplete';
import PacComplete from './PACCompleteScreen';

interface PACNotesRowProps {
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
  lightOrDark: string;
}

export default function PACNotesRow(props: PACNotesRowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

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
            {'Last Note Sent: ' + props.data.lastNoteDate}
          </Text>

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
