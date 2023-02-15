import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { ga4Analytics } from '../../utils/general';
import { GoalDataProps } from '../Goals/interfaces';
import { getGoalData } from '../Goals/api';
import { testForNotificationPre } from '../Goals/handleWinNotifications';
const closeButton = require('../../images/button_close_white.png');

export default function PACCompleteScreen(props: any) {
  const { onSave, setModalVisible, contactName, type } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [note, onNoteChange] = useState('');

  function savePressed() {
    ga4Analytics('PAC_Details_Complete_Save', {
      contentType: 'none',
      itemId: 'id0420',
    });
    fetchGoals(true);
    onSave(note);
  }
  function cancelPressed() {
    setModalVisible(false);
  }

  function getGoalID() {
    if (type == 'calls') return 1;
    if (type == 'notes') return 2;
    if (type == 'popbys') return 3;
    return 4;
  }

  function fetchGoals(isMounted: boolean) {
    setIsLoading(true);
    getGoalData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          notifyIfWin(getGoalID(), res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function notifyIfWin(goalId: number, data: GoalDataProps[]) {
    console.log('GOALID: ' + goalId);
    var i = 0;
    while (i < data.length) {
      if (data[i].goal.id == goalId) {
        testForNotificationPre(
          data[i].goal.title,
          data[i].goal.weeklyTarget,
          data[i].achievedThisWeek,
          data[i].achievedToday
        );
      }
      i = i + 1;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{contactName}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.notesLabel}>Notes</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.noteText}
            placeholder="Type Here"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            value={note}
            onChangeText={onNoteChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  notesLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  inputView: {
    marginTop: 10,
    backgroundColor: '#002341',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  noteText: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
});
