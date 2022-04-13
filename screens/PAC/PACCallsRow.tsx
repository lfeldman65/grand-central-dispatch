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
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useState, useEffect } from 'react';
import { Event } from 'expo-analytics';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { PACDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

interface PACCallsRowProps {
  data: PACDataProps;
  onPress(): void;
}

export default function PACCallsRow(props: PACCallsRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  const handlePhonePressed = (number: string) => {
    console.log(number);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <Button
          color="white"
          onPress={() => {
            console.log('hello');
          }}
          title="DELETE"
        ></Button>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Button
          color="white"
          onPress={() => {
            console.log(props.data.contactName);
          }}
          title="COPY"
        ></Button>
      </View>
    );
  };

  return (
    // <Swipeable
    //   enableTrackpadTwoFingerGesture
    //   leftThreshold={30}
    //   rightThreshold={40}
    //   overshootLeft={false}
    //   overshootRight={false}
    //   renderRightActions={renderRightActions}
    //   renderLeftActions={renderLeftActions}
    // >
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
      </View>
    </TouchableOpacity>
    //   </Swipeable>
  );
}
