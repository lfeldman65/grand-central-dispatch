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
  TextInput,
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

// const chevron = require('../../images/chevron_blue.png');
const searchGlass = require('../../images/whiteSearch.png');
const closeButton = require('../../images/button_close_white.png');
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
  const [popByData, setPopByData] = useState<PopByRadiusDataProps[]>([]);
  const [showAPlus, setShowAPlus] = useState(true);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showC, setShowC] = useState(true);
  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function clearSearchPressed() {
    setSearch('');
  }

  const handleRowPress = (index: number) => {
    console.log('rolodex row press');
    //  analytics.event(new Event('Relationships', 'Go To Details', 'Press', 0));
    navigation.navigate('RelDetails', {
      contactId: popByData[index].id,
      firstName: popByData[index].firstName,
      lastName: popByData[index].lastName,
      rankFromAbove: popByData[index].ranking,
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Pop-By' });
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
      tab: tabSelected,
    });
    getDarkOrLightMode();
    if (tabSelected == 'Near Me') {
      fetchPopBys('nearby');
    } else if (tabSelected == 'Priority') {
      fetchPopBys('priority');
    } else {
      fetchPopBys('favorites');
    }
  }, [isFocused]);

  function matchesSearch(person: PopByRadiusDataProps) {
    var searchLower = search.toLowerCase();
    if (searchLower == '') {
      return true;
    }
    if (person.firstName != null && person.firstName.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.lastName != null && person.lastName.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.street.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.street2.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.city.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.state.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.zip.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.address != null && person.address.country.toLowerCase().includes(searchLower)) {
      return true;
    }
    return false;
  }

  function matchesRankFilter(ranking: String) {
    if (ranking == 'A+' && showAPlus) return true;
    if (ranking == 'A' && showA) return true;
    if (ranking == 'B' && showB) return true;
    if (ranking == 'C' && showC) return true;
    return false;
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

  function getRankPin(ranking: string) {
    // console.log(ranking);
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

  function tapAPlusFilter() {
    console.log('Tap A+ Filter ');
    setShowAPlus(!showAPlus);
  }

  function tapAFilter() {
    console.log('Tap A Filter ');
    setShowA(!showA);
  }

  function tapBFilter() {
    console.log('Tap B Filter ');
    setShowB(!showB);
  }

  function tapCFilter() {
    console.log('Tap C Filter ');
    setShowC(!showC);
  }

  function fetchPopBys(type: string) {
    setIsLoading(true);
    getPopByRadiusData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setPopByData(res.data);
          console.log(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

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

      <View style={lightOrDark == 'dark' ? styles.filterView : styles.filterView}>
        <TouchableOpacity onPress={tapAPlusFilter}>
          <Image source={pinAPlus} style={showAPlus ? styles.pinFilterShow : styles.pinFilterHide} />
        </TouchableOpacity>
        <TouchableOpacity onPress={tapAFilter}>
          <Image source={pinA} style={showA ? styles.pinFilterShow : styles.pinFilterHide} />
        </TouchableOpacity>
        <TouchableOpacity onPress={tapBFilter}>
          <Image source={pinB} style={showB ? styles.pinFilterShow : styles.pinFilterHide} />
        </TouchableOpacity>
        <TouchableOpacity onPress={tapCFilter}>
          <Image source={pinC} style={showC ? styles.pinFilterShow : styles.pinFilterHide} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapView}>
        <MapView
          showsUserLocation={true}
          style={styles.map}
          followsUserLocation={true}
          initialRegion={{ latitude: 33.1175, longitude: -117.25, latitudeDelta: 0.11, longitudeDelta: 0.06 }}
        >
          {popByData.map((person, index) =>
            matchesRankFilter(person.ranking) &&
            matchesSearch(person) &&
            person.location?.latitude != null &&
            person.location?.longitude != null ? (
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
                {popByData.map(
                  (item, index) =>
                    matchesRankFilter(item.ranking) &&
                    matchesSearch(item) && (
                      <PopByRow popByTab={'Near Me'} key={index} data={item} onPress={() => handleRowPress(index)} />
                    )
                )}
              </View>
            )}
            {tabSelected == 'Priority' && (
              <View>
                {popByData.map(
                  (item, index) =>
                    matchesRankFilter(item.ranking) &&
                    matchesSearch(item) && (
                      <PopByRow popByTab={'Priority'} key={index} data={item} onPress={() => handleRowPress(index)} />
                    )
                )}
              </View>
            )}
            {tabSelected == 'Saved' && (
              <View>
                {popByData.map(
                  (item, index) =>
                    matchesRankFilter(item.ranking) &&
                    matchesSearch(item) && (
                      <PopByRowSaved
                        popByTab={'Saved'}
                        key={index}
                        data={item}
                        onPress={() => handleRowPress(index)}
                        refresh={() => savedPressed()}
                      />
                    )
                )}
              </View>
            )}
          </ScrollView>
        </React.Fragment>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  searchView: {
    backgroundColor: '#002341',
    height: 40,
    // marginLeft: 5,
    //  marginRight: 5,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderWidth: 1,
    // borderRadius: 10,
    flexDirection: 'row',
  },
  magGlass: {
    width: 20,
    height: 20,
    marginLeft: -20,
    marginTop: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 300,
  },
  closeX: {
    width: 15,
    height: 15,
    marginRight: -10,
    marginTop: 12,
  },
  filterView: {
    //  backgroundColor: 'red',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 8,
    marginLeft: '20%',
    marginRight: '20%',
  },
  pinFilterShow: {
    width: 30,
    height: 43,
    opacity: 1.0,
  },
  pinFilterHide: {
    width: 30,
    height: 43,
    opacity: 0.4,
  },
  mapView: {
    height: '60%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
