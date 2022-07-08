import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getRolodexData } from './api';
import { RolodexDataProps } from './interfaces';
import AttendeeRow from './AttendeeRow';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const closeButton = require('../../images/button_close_white.png');
const backArrow = require('../../images/white_arrow_left.png');

export default function AttendeeScreen(props: any) {
  const { title, setModalAttendeesVisible, setSelectedAttendees } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);

  const handleRowPress = (index: number) => {
    console.log('row pressed');
  };

  function savePressed() {
    setModalAttendeesVisible(false);
    setSelectedAttendees(dataRolodex.filter((item) => item.selected));
    //  onSave(note);
  }
  function cancelPressed() {
    setModalAttendeesVisible(false);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    fetchRolodexPressed('alpha');
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function fetchRolodexPressed(type: string) {
    setIsLoading(true);
    getRolodexData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={backArrow} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity onPress={savePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <ScrollView>
          <View>
            {dataRolodex.map((item, index) => (
              <AttendeeRow relFromAbove={'Rel'} key={index} data={item} onPress={() => handleRowPress(index)} />
            ))}
          </View>
        </ScrollView>
      )}
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
  notesText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
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
