import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import closeButton from '../../assets/button_close_white.png';

export default function PACCompleteScreen(props) {
  const { onSave, setModalVisible, contactName } = props;
  const [note, onNoteChange] = useState('');

  function SavePressed() {
    onSave(note);
  }
  function CancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{contactName}</Text>

        <TouchableOpacity onPress={SavePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.notesText}>Notes</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Type Here"
            placeholderTextColor="#AFB9C2"
            color="black"
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
    marginTop: 20,
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
  notesText: {
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
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInput: {
    paddingTop: 5,
    fontSize: 18,
  },
});
