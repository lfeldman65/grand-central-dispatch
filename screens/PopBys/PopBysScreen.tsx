import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import { matchesSearch } from './popByHelpers';

const searchGlass = require('../../images/whiteSearch.png');
const closeButton = require('../../images/button_close_white.png');
const blankSpace = require('../Podcasts/images/audio_blank.png');
const saveAll = require('./images/saveAll.png');
const unsaveAll = require('./images/removeAll.png');
const routeCircle = require('./images/routeCircle.png');
const routeX = require('./images/routeX.png');
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
  const [popByData, setPopByData] = useState<PopByRadiusDataProps[]>([]);
  const [showAPlus, setShowAPlus] = useState(true);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showC, setShowC] = useState(true);
  const [search, setSearch] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setIsLightOrDark] = useState('');

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
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
    navigation.setOptions({
      title: 'Pop-By',
      headerLeft: () => <MenuIcon />,
      tab: tabSelected,
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    if (tabSelected == 'Near Me') {
      fetchPopBys('nearby', isMounted);
    } else if (tabSelected == 'Priority') {
      fetchPopBys('priority', isMounted);
    } else {
      fetchPopBys('favorites', isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function matchesRankFilter(ranking: string) {
    if (ranking == 'A+' && showAPlus) return true;
    if (ranking == 'A' && showA) return true;
    if (ranking == 'B' && showB) return true;
    if (ranking == 'C' && showC) return true;
    return false;
  }

  function nearPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Near Me', 0));
    setTabSelected('Near Me');
    fetchPopBys('Near Me', true);
  }

  function priorityPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    setTabSelected('Priority');
    fetchPopBys('Priority', true);
  }

  function savedPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    setTabSelected('Saved');
    fetchPopBys('Saved', true);
  }

  function getRankPin(ranking: string) {
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

  function toggleRouteButton() {
    if (showRoute) {
      handleShortestRoute();
    } else {
      handleClosestToFarthest();
    }
    setShowRoute(!showRoute);
  }

  function handleShortestRoute() {
    console.log('handle shortest route');
  }

  function handleClosestToFarthest() {
    console.log('handle closest to farthest');
    fetchPopBys('favorites', true);
  }

  function saveOrUnsavePressed() {
    if (tabSelected == 'Saved') {
      unSaveAllPressed();
    } else {
      saveAllPressed();
    }
  }

  function saveAllPressed() {
    console.log('save all pressed');
  }

  function unSaveAllPressed() {
    console.log('unsave all pressed');
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

  function getRouteButton() {
    if (tabSelected == 'Near Me' || tabSelected == 'Priority') {
      return blankSpace;
    }
    if (showRoute) {
      return routeX;
    }
    return routeCircle;
  }

  function getSavedButton() {
    if (tabSelected == 'Near Me' || tabSelected == 'Priority') {
      return saveAll;
    }
    return unsaveAll;
  }

  function fetchPopBys(type: string, isMounted: boolean) {
    if (!isMounted) {
      return false;
    }
    setIsLoading(true);
    getPopByRadiusData(type)
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setPopByData(res.data);
          //  console.log(res.data);
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

      <View style={styles.buttonView}>
        <View style={styles.actionButtonView}>
          <TouchableOpacity onPress={toggleRouteButton}>
            <Image source={getRouteButton()} style={styles.actionButtons} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterView}>
          <TouchableOpacity onPress={tapAPlusFilter}>
            <Image source={pinAPlus} style={showAPlus ? styles.pinFilterShow : styles.pinFilterDim} />
          </TouchableOpacity>
          <TouchableOpacity onPress={tapAFilter}>
            <Image source={pinA} style={showA ? styles.pinFilterShow : styles.pinFilterDim} />
          </TouchableOpacity>
          <TouchableOpacity onPress={tapBFilter}>
            <Image source={pinB} style={showB ? styles.pinFilterShow : styles.pinFilterDim} />
          </TouchableOpacity>
          <TouchableOpacity onPress={tapCFilter}>
            <Image source={pinC} style={showC ? styles.pinFilterShow : styles.pinFilterDim} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonView}>
          <TouchableOpacity onPress={saveOrUnsavePressed}>
            <Image source={getSavedButton()} style={styles.actionButtons} />
          </TouchableOpacity>
        </View>
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
            matchesSearch(person, search) &&
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
          <View style={styles.searchView}>
            <Image source={searchGlass} style={styles.magGlass} />
            <TextInput
              style={styles.textInput}
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
            {tabSelected == 'Near Me' && (
              <View>
                {popByData.map(
                  (item, index) =>
                    matchesRankFilter(item.ranking) &&
                    matchesSearch(item, search) && (
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
                    matchesSearch(item, search) && (
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
                    matchesSearch(item, search) && (
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
    backgroundColor: '#1a6295',
    height: 40,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderColor: 'white',
    borderWidth: 1,
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
    color: 'white',
    width: 300,
  },
  closeX: {
    width: 15,
    height: 15,
    marginRight: -10,
    marginTop: 12,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  filterView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 8,
    width: '50%',
  },
  pinFilterShow: {
    width: 30,
    height: 43,
    opacity: 1.0,
  },
  pinFilterDim: {
    width: 30,
    height: 43,
    opacity: 0.4,
  },
  actionButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '20%',
    paddingTop: 8,
  },
  actionButtons: {
    width: 40,
    height: 40,
  },
  mapView: {
    height: '50%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  blankButton: {
    // Helps placement of route button, save/unsave buttons, and filter pins
    width: 30,
  },
});
