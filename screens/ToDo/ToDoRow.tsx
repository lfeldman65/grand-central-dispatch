import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { ToDoDataProps } from './interfaces';
import * as React from 'react';
import { prettyDate } from '../../utils/general';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteToDo, markCompleteToDo } from './api';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const bullsEye = require('../ToDo/images/campaign.png');

interface ToDoRowProps {
  key: number;
  data: ToDoDataProps;
  onPress(): void;
  lightOrDark: string;
  refresh(): void;
  close(s: Swipeable): void;
}

export default function ToDoRow(props: ToDoRowProps) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  var _swipeableRow: Swipeable;

  const renderLeftActions = () => {
    if (false) {
      return null;
    } else {
      return (
        <View style={styles.leftSwipeItem}>
          <TouchableOpacity
            style={styles.swipeButtonTouch}
            onPress={() => {
              deletePressed();
            }}
          >
            <Text style={styles.leftButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

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
    if (props.data.completedDate != null) {
      return null;
    } else {
      return (
        <View style={styles.rightSwipeItem}>
          <TouchableOpacity
            style={styles.swipeButtonTouch}
            onPress={() => {
              completePressed();
            }}
          >
            <Text style={styles.leftButton}>Complete</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  async function completePressed() {
    console.log('completePressed');
    console.log(props.data.id);
    // ga4Analytics('To_Do_Complete_Or_Close', {
    //   contentType: 'none',
    //   itemId: 'id1206',
    // });
    if (props.data?.isCampaign!) {
      navigation.goBack();
      return;
    }
    setIsLoading(true);
    markCompleteToDo(props.data.id)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          props.refresh();
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  async function deletePressed() {
    // ga4Analytics('PAC_Swipe_Complete', {
    //   contentType: 'Calls',
    //   itemId: 'id0416',
    // });
    // setModalVisible(true);
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
    console.log('delete pressed');
    deleteToDo(props.data.id)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          props.refresh();
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

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
          <View style={styles.imageBox}>
            {props.data.isCampaign && <Image source={bullsEye} style={styles.bullsEyeImage} />}
          </View>
          <View style={props.lightOrDark == 'dark' ? styles.textBoxDark : styles.textBoxLight}>
            <Text style={props.lightOrDark == 'dark' ? styles.titleTextDark : styles.titleTextLight}>
              {props.data.title}
            </Text>
            <Text style={props.lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
              {props.data.notes}
            </Text>
          </View>
          <View style={styles.dateColumn}>
            <View style={props.lightOrDark == 'dark' ? styles.dateViewDark : styles.dateViewLight}>
              <Text style={props.lightOrDark == 'dark' ? styles.regTextDark : styles.regTextLight}>
                {prettyDate(props.data.dueDate)}
              </Text>
              {props.data.priority && <Text style={styles.priorityText}>High Priority</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
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
