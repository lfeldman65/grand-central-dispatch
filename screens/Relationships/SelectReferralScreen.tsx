import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Event } from 'expo-analytics';
import { styles } from './styles';
import { analytics } from '../../utils/analytics';
import { getRolodexData } from './api';
import { RolodexDataProps } from './interfaces';
import IdeasCalls from '../PAC/IdeasCallsScreen';
import IdeasNotes from '../PAC/IdeasNotesScreen';
import IdeasPop from '../PAC/IdeasPopScreen';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';
import AtoZRow from './AtoZRow';
import AddNewRef from './AddNewReferral';

const backArrow = require('../../images/white_arrow_left.png');
const searchGlass = require('../../images/whiteSearch.png');

type TabType = 'Search Existing' | 'Add New';

export default function SelectReferralScreen(props: any) {
  const { setModalVisible, title, setReferral } = props;
  const [tabSelected, setTabSelected] = useState<TabType>('Search Existing');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    setReferral(dataRolodex[index]);
    setModalVisible(false);
    //  analytics.event(new Event('PAC', 'Go To Details'));
    // navigation.navigate('PACDetail', {
    //   contactId: data[index]['contactId'],
    //   type: data[index]['type'],
    //   ranking: data[index]['ranking'],
    //   lastCallDate: data[index]['lastCallDate'],
    //   lastNoteDate: data[index]['lastNoteDate'],
    //   lastPopByDate: data[index]['lastPopByDate'],
    // });
  };

  //   useEffect(() => {
  //     navigation.setOptions({
  //       headerLeft: () => <MenuIcon />,
  //       tab: tabSelected,
  //     });
  //   }, []);

  useEffect(() => {
    if (tabSelected == 'Search Existing') {
      fetchRolodexPressed('alpha');
    }
  }, [isFocused]);

  function existingPressed() {
    //  analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('Search Existing');
    fetchRolodexPressed('alpha');
  }

  function addNewPressed() {
    //  analytics.event(new Event('PAC', 'Notes Tab'));
    setTabSelected('Add New');
    // fetchRolodexPressed('alpha');
  }

  function cancelPressed() {
    setModalVisible(false);
  }

  function searchPressed() {
    console.log('search pressed');
  }

  function fetchRolodexPressed(type: string) {
    setIsLoading(true);
    getRolodexData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  useEffect(() => {
    fetchRolodexPressed('alpha');
  }, [isFocused]);

  // useEffect(() => {
  //   if (route?.params?.contactToRemoveId) {
  //     const filteredData = data.filter((item) => item.contactId != route?.params?.contactToRemoveId);
  //     console.log(`filteredData: ${filteredData}`);
  //     setData(filteredData);
  //   }
  // }, []);

  return (
    <View style={styles2.container}>
      <View style={styles2.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={backArrow} style={styles2.backArrow} />
        </TouchableOpacity>
        <Text style={styles2.nameLabel}>{title}</Text>
        <TouchableOpacity onPress={searchPressed}>
          <Image source={searchGlass} style={styles2.searchGlass} />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.tabButtonRow}>
        <Text
          style={tabSelected == 'Search Existing' ? globalStyles.selected : globalStyles.unselected}
          onPress={existingPressed}
        >
          Search Existing
        </Text>
        <Text
          style={tabSelected == 'Add New' ? globalStyles.selected : globalStyles.unselected}
          onPress={addNewPressed}
        >
          Add New
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {tabSelected == 'Search Existing' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <AtoZRow relFromAbove={'Rel'} key={index} data={item} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            )}
            {tabSelected == 'Add New' && (
              <View>
                <AddNewRef></AddNewRef>
              </View>
            )}
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
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButtonView: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  backArrow: {
    width: 17,
    height: 14,
    marginLeft: 5,
    marginTop: 2,
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
});
