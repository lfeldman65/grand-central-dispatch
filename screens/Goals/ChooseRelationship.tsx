import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getRolodexData, getRolodexSearch } from './api';
import { RolodexDataProps } from './interfaces';
import RelationshipRow from './ChooseRelRow';

const closeButton = require('../../images/button_close_white.png');
const backArrow = require('../../images/white_arrow_left.png');
const searchGlass = require('../../images/whiteSearch.png');

export default function ChooseRelationship(props: any) {
  const { title, setModalRelVisible, setSelectedRel, lightOrDark } = props;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [search, setSearch] = useState('');

  const handleRowPress = (index: number) => {
    console.log(dataRolodex[index].firstName);
    setSelectedRel(dataRolodex[index]);
    setModalRelVisible(false);
  };

  function clearSearchPressed() {
    setSearch('');
  }

  function cancelPressed() {
    setModalRelVisible(false);
  }

  useEffect(() => {
    console.log('search: ' + search);
    if (search != '') {
      fetchRolodexSearch(search);
    } else {
      fetchRolodexPressed('alpha', true);
    }
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    fetchRolodexPressed('alpha', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function fetchRolodexSearch(type: string) {
    setIsLoading(true);
    getRolodexSearch(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchRolodexPressed(type: string, isMounted: boolean) {
    console.log('fetch rolodex');
    setIsLoading(true);
    getRolodexData(type)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          //  console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={backArrow} style={styles.backArrow} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{'       ' + title}</Text>

        <TouchableOpacity>
          <Text style={styles.saveButton}>{'        '}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchView}>
        <Image source={searchGlass} style={styles.magGlass} />

        <TextInput
          style={styles.textInput}
          placeholder="Search By Name or Address"
          placeholderTextColor="#AFB9C2"
          textAlign="left"
          defaultValue={search}
          onChangeText={(text) => setSearch(text)}
        />

        <TouchableOpacity onPress={clearSearchPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {dataRolodex.map((item, index) => (
            <RelationshipRow key={index} data={item} lightOrDark={lightOrDark} onPress={() => handleRowPress(index)} />
          ))}
        </View>
      </ScrollView>
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
  searchView: {
    backgroundColor: '#002341',
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 7,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 300,
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
    marginRight: -10,
    marginTop: 12,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: -10,
    marginTop: 1,
  },
  magGlass: {
    width: 20,
    height: 20,
    marginLeft: -20,
    marginTop: 8,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 30,
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
