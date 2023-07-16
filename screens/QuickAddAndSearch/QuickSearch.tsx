import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getRolodexSearch } from '../ToDo/api';
import { RolodexDataProps } from '../Relationships/interfaces';
import AtoZRow from '../Relationships/AtoZRow';
import globalStyles from '../../globalStyles'; // test.

const closeButton = require('../../images/button_close_white.png');
const searchGlass = require('../../images/whiteSearch.png');
const searchBlank = require('../../images/blankSearch.png'); // Preserves horizontal alignment of title bar

export default function QuickSearch(props: any) {
  const { setModalVisible, title, lightOrDark } = props;
  const navigation = useNavigation();
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const searchInputRef = useRef<TextInput>(null);

  const handleRowPress = (index: number) => {
    console.log('Index:' + index);
    setModalVisible(false);
    navigation.navigate('RelDetails', {
      contactId: dataRolodex[index].id,
      firstName: dataRolodex[index].firstName,
      lastName: dataRolodex[index].lastName,
      lightOrDark: lightOrDark,
    });
  };

  useEffect(() => {
    console.log('search: ' + search);
    if (search != '') {
      fetchRolodexSearch(search);
    }
  }, [search]);

  useEffect(() => {
    handleSearchFocus();
  }, [isFocused]);

  function clearSearchPressed() {
    setSearch('');
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  function searchPressed() {
    console.log('search pressed');
  }

  function handleSearchFocus() {
    console.log('SEARCH: ' + searchInputRef.current);
    if (searchInputRef != null && searchInputRef.current != null) {
      console.log('here');
      searchInputRef.current.focus();
    }
  }

  function fetchRolodexSearch(type: string) {
    setIsLoading(true);
    getRolodexSearch(type)
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
    <View style={styles2.container}>
      <View style={styles2.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={globalStyles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles2.nameLabel}>{title}</Text>
        <TouchableOpacity onPress={searchPressed}>
          <Image source={searchBlank} style={styles2.blankButton} />
        </TouchableOpacity>
      </View>
      <View style={styles2.searchView}>
        <Image source={searchGlass} style={styles2.magGlass} />
        <TextInput
          style={styles2.textInput}
          ref={searchInputRef}
          onPressIn={handleSearchFocus}
          placeholder="Search By Name or Address"
          placeholderTextColor="#AFB9C2"
          textAlign="left"
          defaultValue={search}
          onChangeText={(text) => setSearch(text)}
        />

        <TouchableOpacity onPress={clearSearchPressed}>
          <Image source={closeButton} style={styles2.closeX} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            <View>
              {dataRolodex.map((item, index) => (
                <AtoZRow
                  relFromAbove={item.contactTypeID}
                  key={index}
                  data={item}
                  lightOrDark={lightOrDark}
                  onPress={() => handleRowPress(index)}
                />
              ))}
            </View>
          </ScrollView>
        </React.Fragment>
      )}
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#004F89',
    flex: 1,
    height: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 10,
  },
  searchGlass: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
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
  magGlass: {
    width: 20,
    height: 20,
    marginLeft: -20,
    marginTop: 8,
  },
  closeX: {
    width: 15,
    height: 15,
    marginRight: -10,
    marginTop: 12,
  },
  blankButton: {
    width: 100,
  },
});
