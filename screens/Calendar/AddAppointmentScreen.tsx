import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useIsFocused } from '@react-navigation/native';
import { addNewAppointment } from './api';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';

export default function AddAppointmentScreen(props: any) {
  const { setModalVisible, title, onSave } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');

  function savePressed() {
    setModalVisible(false);
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  filterView: {
    width: '100%',
    padding: 12,
  },
  footer: {
    // Can't scroll to bottom of Notes without this
    height: 250,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  untilRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
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
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  untilView: {
    backgroundColor: '#002341',
    width: '42%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  weekView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  notesView: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  attendeeView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    fontSize: 29,
    flexDirection: 'row',
  },
  attendeeInput: {
    fontSize: 18,
    color: 'silver',
    marginTop: 10,
    paddingLeft: 10,
    width: '92%',
  },
  addAttendee: {
    fontSize: 18,
    color: 'silver',
    width: 300,
  },
  deleteAttendeeX: {
    width: 10,
    height: 10,
  },
  checkBox: {
    marginTop: 12,
    left: 20,
    marginBottom: 25,
  },
  inputViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInputDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  textInputLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
