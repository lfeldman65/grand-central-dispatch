import { Text, View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { RolodexDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { styles } from './styles';
import { displayName } from './relationshipHelpers';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface AtoZRowProps {
  key: number;
  data: RolodexDataProps;
  onPress(): void;
  relFromAbove: string;
  lightOrDark: string;
  refresh(): void;
  deleteContact(): void;
  close(s: Swipeable): void;
}

export default function AtoZRow(props: AtoZRowProps) {
  const { relFromAbove } = props;
  const [displayOrder, setDisplayOrder] = useState('First Last');
  const isFocused = useIsFocused();
  var _swipeableRow: Swipeable;

  function noSwipe() {}

  const renderLeftActions = () => {
    return (
      <View style={styles2.leftSwipeItem}>
        <TouchableOpacity
          style={styles2.swipeButtonTouch}
          onPress={() => {
            deletePressed();
          }}
        >
          <Text style={styles2.leftButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  function handleSwipeBegin(rowKey: number) {
    console.log('handle swipe');
    //   props.close(_swipeableRow);
    //   props.data.swipeRef = _swipeableRow;
  }

  function handleSwipeEnd() {
    console.log('swipe end');
    props.data.swipeRef = null;
  }

  function updateRef(ref: Swipeable) {
    _swipeableRow = ref;
  }

  async function completePressed() {}

  const renderRightActions = () => {
    return (
      <View style={styles2.rightSwipeItem}>
        <TouchableOpacity
          style={styles2.swipeButtonTouch}
          onPress={() => {
            completePressed();
          }}
        >
          <Text style={styles2.leftButton}>Track</Text>
        </TouchableOpacity>
      </View>
    );
  };

  async function deletePressed() {
    console.log('delete pressed');
    Alert.alert(
      'Are you sure you want to delete this To Do?',
      '',
      [
        {
          text: 'Delete',
          onPress: () => deletePressedContinue(),
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

  function deletePressedContinue() {
    console.log('delete pressed AAAAAA');
    props.deleteContact();
    //props.refresh();
  }

  useEffect(() => {
    let isMounted = true;
    getDisplayAZ(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function chooseImage(rank: string) {
    if (rank == 'A+') return rankAPlus;
    if (rank == 'A') return rankA;
    if (rank == 'B') return rankB;
    if (rank == 'C') return rankC;
    return rankD;
  }

  async function getDisplayAZ(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const relOrder = await storage.getItem('displayAZ');
    if (relOrder == null || relOrder == 'First Last') {
      setDisplayOrder('First Last');
    } else {
      setDisplayOrder('Last, First');
    }
  }

  return (
    <Swipeable
      ref={updateRef}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={noSwipe}
      renderLeftActions={noSwipe}
      onSwipeableWillOpen={() => handleSwipeBegin(props.key)}
      onSwipeableWillClose={handleSwipeEnd}
      friction={2}
    >
      <TouchableOpacity onPress={props.onPress}>
        {props.data.contactTypeID == relFromAbove && (
          <View style={props.lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
            <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
            <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {displayName(
                props.data.firstName,
                props.data.lastName,
                props.data.contactTypeID,
                props.data.employerName,
                displayOrder
              )}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles2 = StyleSheet.create({
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 'auto',
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 'auto',
  },
  dateColumn: {
    flexDirection: 'column',
  },
  imageBox: {
    width: 30,
    height: 30,
    alignItems: 'center',
    paddingTop: 25,
    marginLeft: 7,
    marginRight: 7,
  },
  bullsEyeImage: {
    height: 30,
    width: 30,
  },
  textBoxDark: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'black',
    width: '65%',
    marginLeft: 5,
    textAlign: 'left',
  },
  textBoxLight: {
    flexDirection: 'column',
    height: 75,
    backgroundColor: 'white',
    width: '65%',
    marginLeft: 5,
    textAlign: 'left',
  },
  titleTextDark: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    fontWeight: '500',
  },
  titleTextLight: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    fontWeight: '500',
  },
  regTextDark: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 3,
  },
  regTextLight: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 1,
    marginBottom: 1,
    marginTop: 3,
  },
  dateViewDark: {
    justifyContent: 'space-between',
    marginTop: -4,
    backgroundColor: 'black',
  },
  dateViewLight: {
    justifyContent: 'space-between',
    marginTop: -4,
    backgroundColor: 'white',
  },
  priorityText: {
    marginTop: 5,
    color: '#F99055',
    fontSize: 14,
  },
  leftSwipeItem: {
    justifyContent: 'center',
    margin: 0,
    alignContent: 'center',
    width: 100,
    backgroundColor: 'red',
  },
  rightSwipeItem: {
    justifyContent: 'center',
    margin: 0,
    alignContent: 'center',
    width: 120,
    backgroundColor: '#56BE42',
  },
  leftButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: 'white',
    fontSize: 18,
  },
  swipeButtonTouch: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    color: 'white',
    fontSize: 18,
  },
});
