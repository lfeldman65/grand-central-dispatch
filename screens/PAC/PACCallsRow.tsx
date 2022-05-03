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
  Animated,
  Button,
  Modal,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useState, useEffect } from 'react';
import { Event } from 'expo-analytics';
import { styles } from './styles';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { PACDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import PacComplete from './PACCompleteScreen';
import { postponeAction, completeAction } from './postponeAndComplete';

interface PACCallsRowProps {
  data: PACDataProps;
  onPress(): void;
  refresh(): void;
}

export default function PACCallsRow(props: PACCallsRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handlePhonePressed = (number: string) => {
    console.log(number);
  };

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
        <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
            {props.data.contactName}
          </Text>
          <Text style={lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Ranking: ' + props.data.ranking}
          </Text>

          <Text style={lightOrDark == 'dark' ? styles.otherTextDark : styles.otherTextLight}>
            {'Last Call: ' + props.data.lastCallDate}
          </Text>

          {props.data.mobilePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.mobilePhone)}>
              <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobilePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.officePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.officePhone)}>
              <Text style={styles.phoneNumber}>{'Office: ' + props.data.officePhone}</Text>
            </TouchableOpacity>
          )}

          {props.data.homePhone != null && (
            <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.homePhone)}>
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
              />
            </Modal>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
