import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import React from 'react';
import SortScreenRow from './SortScreenRow';
import { RolodexImportDataProps } from './interfaces';
import { changeRankAndQual } from '../Relationships/api';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { getRolodexSearch } from '../ToDo/api';
import { ScreenContainer } from 'react-native-screens';
const searchGlass = require('../../images/whiteSearch.png');
const closeButton = require('../../images/button_close_white.png');

export default function SortScreen2(props: any) {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [dataRolodex, setDataRolodex] = useState<RolodexImportDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  const handleRankPress = (index: number, rank: string) => {
    console.log(rank + ' ' + index);
    dataRolodex[index].ranking = rank;
    dataRolodex[index].didChange = true;
    var contactsToDisplay: RolodexImportDataProps[] = [];
    for (let i = 0; i < dataRolodex.length; i++) {
      contactsToDisplay.push(dataRolodex[i]);
    }
    setDataRolodex(contactsToDisplay);
  };

  const handleQualChange = (index: number) => {
    console.log('onQualChanged');
    dataRolodex[index].didChange = true;
    if (dataRolodex[index].qualified) {
      dataRolodex[index].qualified = false;
    } else {
      dataRolodex[index].qualified = true;
    }
    console.log('QUAL: ' + dataRolodex[index].qualified);
    var contactsToDisplay: RolodexImportDataProps[] = [];
    for (let i = 0; i < dataRolodex.length; i++) {
      contactsToDisplay.push(dataRolodex[i]);
    }
    setDataRolodex(contactsToDisplay);
  };

  useEffect(() => {
    console.log('search: ' + search);
    fetchRolodexSearch(search);
  }, [search]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Sort Your Relationships',
      headerRight: () => (
        <TouchableOpacity style={styles.doneButton} onPress={donePressed}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, search, dataRolodex]);

  function clearSearchPressed() {
    console.log('clear search');
    setSearch('');
  }

  async function donePressed() {
    for (var i = 0; i < dataRolodex.length; i++)
      if (dataRolodex[i].didChange) {
        console.log('Index to save: ' + i);
        await quickUpdateRankQual(i);
      }
    navigation.navigate('SettingsScreen');
  }

  async function quickUpdateRankQual(index: number) {
    await changeRankAndQual(
      dataRolodex[index].id,
      dataRolodex[index].ranking,
      dataRolodex[index].qualified ? 'True' : 'False'
    )
      .then((res) => {
        if (res.status == 'error') {
          console.log(res);
          //   Alert.alert(res.error);
        } else {
          //  console.log(res);
        }
        //  setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  function fetchRolodexSearch(type: string) {
    setIsLoading(true);
    getRolodexSearch(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
          //   console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Image source={searchGlass} style={styles.magGlass} />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search By Name or Address"
            placeholderTextColor="white"
            textAlign="left"
            defaultValue={search}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity onPress={clearSearchPressed}>
            <Image source={closeButton} style={styles.closeX} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {dataRolodex.map((item, index) => (
            <SortScreenRow
              relFromAbove={item.firstName}
              search={search}
              key={index}
              data={item}
              lightOrDark={lightOrDark}
              onQualChange={() => handleQualChange(index)}
              onRankChange={(rank) => handleRankPress(index, rank)}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  searchView: {
    backgroundColor: '#002F4A',
    height: 40,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderColor: 'white',
    borderWidth: 0.5,
    flexDirection: 'row',
    marginTop: 1,
    marginBottom: 1,
  },
  searchTextInput: {
    fontSize: 16,
    color: 'white',
    width: 300,
  },
  magGlass: {
    width: 20,
    height: 20,
    marginTop: 9,
    marginLeft: -15,
  },
  closeX: {
    width: 15,
    height: 15,
    marginTop: 12,
  },
  doneButton: {
    padding: 5,
  },
  doneText: {
    color: 'white',
    fontSize: 18,
  },
});
