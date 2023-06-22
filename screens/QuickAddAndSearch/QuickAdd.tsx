import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import React from 'react';
import { getProfileData } from '../Settings/api';
import { ProfileDataProps } from '../Settings/interfaces';
import { RolodexDataProps } from '../Relationships/interfaces';
import { ga4Analytics } from '../../utils/general';
import AddToDo from '../ToDo/AddToDoScreen';
import AddAppt from '../Calendar/AddAppointmentScreen';
import AddRelationshipScreen from '../Relationships/AddRelationshipScreen';

export default function QuickAdd(props: any) {
  const { route } = props;
  const { lightOrDark } = route.params;
  const [showAddToDoModal, setShowAddToDoModal] = useState(false);
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [showAddRelModal, setShowAddRelModal] = useState(false);
  const navigation = useNavigation<any>();

  function saveComplete() {
    console.log('save to do complete');
  }

  function buttonPressed(index: number) {
    if (index == 0) {
      ga4Analytics('Quick_Add_Relationship', {
        contentType: 'none',
        itemId: 'id1700',
      });
      setShowAddRelModal(true);
    } else if (index == 1) {
      ga4Analytics('Quick_Add_To_Do', {
        contentType: 'none',
        itemId: 'id1701',
      });
      setShowAddToDoModal(true);
    } else if (index == 2) {
      ga4Analytics('Quick_Add_Appointment', {
        contentType: 'none',
        itemId: 'id1702',
      });
      setShowAddApptModal(true);
    } else if (index == 3) {
      ga4Analytics('Quick_Add_Transaction', {
        contentType: 'none',
        itemId: 'id1703',
      });
      navigation.navigate('AddTxMenu', {
        person: null,
        source: 'Transactions',
        lightOrDark: lightOrDark,
      });
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: 'Quick Add',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(0)}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Add Relationship'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(1)}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Add To Do'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(2)}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Add Appointment'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(3)}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Add Transaction'}</Text>
        </View>
      </TouchableOpacity>
      {showAddToDoModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddToDoModal}
          onRequestClose={() => {
            setShowAddToDoModal(!showAddToDoModal);
          }}
        >
          <AddToDo
            title={'New To-Do'}
            lightOrDark={lightOrDark}
            onSave={saveComplete}
            setModalVisible={setShowAddToDoModal}
          />
        </Modal>
      )}
      {showAddApptModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddApptModal}
          onRequestClose={() => {
            setShowAddApptModal(!showAddApptModal);
          }}
        >
          <AddAppt title={'New Appointment'} onSave={saveComplete} setModalVisible={setShowAddApptModal} />
        </Modal>
      )}
      {showAddRelModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddRelModal}
          onRequestClose={() => {
            setShowAddRelModal(!showAddRelModal);
          }}
        >
          <AddRelationshipScreen
            title={'New Relationship'}
            onSave={saveComplete}
            setModalVisible={setShowAddRelModal}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
    borderWidth: 0.5,
    borderTopColor: 'white',
  },
  buttonContainer: {
    backgroundColor: '#1A6295',
    height: 60,
    marginTop: 10,
    marginBottom: 2,
  },
  buttonView: {
    backgroundColor: '#1A6295',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 6,
    height: 50,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
  },
});
