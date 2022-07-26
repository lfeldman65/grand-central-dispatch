import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import PopByRow from './PopByRow';
import PopByRowSaved from './PopByRowSaved';
import { getPopByRadiusData } from './api';
import { PopByRadiusDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { storage } from '../../utils/storage';
import PopComplete from './PopCompleteScreen';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const chevron = require('../../images/chevron_blue.png');
const pinAPlus = require('./images/mapPinAPlus.png');
const pinA = require('./images/mapPinA.png');
const pinB = require('./images/mapPinB.png');
const pinC = require('./images/mapPinC.png');
const pinD = require('./images/mapPinD.png');

type TabType = 'Near Me' | 'Priority' | 'Saved'; // nearby, priority and favorites in API

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('Near Me');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<PopByRadiusDataProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (index: number) => {
    console.log('rolodex row press');
    //  analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    navigation.navigate('RelDetails', {
      contactId: data[index]['id'],
      firstName: data[index]['firstName'],
      lastName: data[index]['lastName'],
      rankFromAbove: data[index]['ranking'],
      //  qualFromAbove: dataRolodex[index]['qualified'],
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      tab: tabSelected,
    });
  }, []);

  useEffect(() => {
    getDarkOrLightMode();
    if (tabSelected == 'Near Me') {
      fetchPopBys('nearby');
    } else if (tabSelected == 'Priority') {
      fetchPopBys('priority');
    } else {
      fetchPopBys('favorites');
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({ title: 'Pop-By' });
    //  fetchPopBys(tabSelected);
    console.log(tabSelected);
  }, [isFilterRel]);

  useEffect(() => {
    showFilterTitle();
  }, [isFilterRel]);

  //  useEffect(() => {}); // this will run on every render

  function showFilterTitle() {
    if (isFilterRel) {
      return 'Rel';
    }
    return 'Biz';
  }

  function nearPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Near Me', 0));
    setTabSelected('Near Me');
    fetchPopBys('Near Me');
  }

  function priorityPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    setTabSelected('Priority');
    fetchPopBys('Priority');
  }

  function savedPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    setTabSelected('Saved');
    fetchPopBys('Saved');
  }

  function filterPressed() {
    console.log('filter');
    //  analytics.event(new Event('Manage Relationships', 'Filter', 'Press', 0));
    if (isFilterRel) {
      setIsFilterRel(false);
    } else {
      setIsFilterRel(true);
      showFilterTitle();
    }
  }

  function getRankPin(ranking: string) {
    console.log(ranking);
    if (ranking == 'A+') {
      return pinAPlus;
    }
    if (ranking == 'A') {
      return pinA;
    }
    if (ranking == 'B') {
      return pinB;
    }
    if (ranking == 'C') {
      return pinC;
    }
    return pinD;
  }

  function fetchPopBys(type: string) {
    setIsLoading(true);
    getPopByRadiusData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setData(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  // function saveComplete() {
  //   fetchPopBys('alpha');
  // }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={globalStyles.tabButtonRow}>
        <Text style={tabSelected == 'Near Me' ? globalStyles.selected : globalStyles.unselected} onPress={nearPressed}>
          Near Me
        </Text>
        <Text
          style={tabSelected == 'Priority' ? globalStyles.selected : globalStyles.unselected}
          onPress={priorityPressed}
        >
          Priority
        </Text>
        <Text style={tabSelected == 'Saved' ? globalStyles.selected : globalStyles.unselected} onPress={savedPressed}>
          Saved
        </Text>
      </View>

      <View style={styles.mapView}>
        <MapView
          showsUserLocation={true}
          style={styles.map}
          followsUserLocation={true}
          initialRegion={{ latitude: 33.1175, longitude: -117.25, latitudeDelta: 0.11, longitudeDelta: 0.06 }}
        >
          {data.map((person, index) =>
            person.location?.latitude != null && person.location?.longitude != null ? (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(person.location.latitude),
                  longitude: parseFloat(person.location.longitude),
                }}
                image={getRankPin(person.ranking)}
                title={person.firstName + ' ' + person.lastName}
                description={person.lastPopbyDate != null ? 'Last PopBy: ' + person.lastPopbyDate : 'Last PopBy: None'}
              />
            ) : (
              <View></View>
            )
          )}
        </MapView>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {tabSelected == 'Near Me' && (
              <View>
                {data.map((item, index) => (
                  <PopByRow relFromAbove={'Near Me'} key={index} data={item} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            )}
            {tabSelected == 'Priority' && (
              <View>
                {data.map((item, index) => (
                  <PopByRow relFromAbove={'Priority'} key={index} data={item} onPress={() => handleRowPress(index)} />
                ))}
              </View>
            )}
            {tabSelected == 'Saved' && (
              <View>
                {data.map((item, index) => (
                  <PopByRowSaved
                    relFromAbove={'Saved'}
                    key={index}
                    data={item}
                    onPress={() => handleRowPress(index)}
                    refresh={() => savedPressed()}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </React.Fragment>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  mapView: {
    height: '60%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
