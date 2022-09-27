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
  Alert,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import PopByRow from './PopByRow';
import PopByRowSaved from './PopByRowSaved';
import { getPopByRadiusData, removePop, savePop } from './api';
import { PopByRadiusDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { storage } from '../../utils/storage';
import PopComplete from './PopCompleteScreen';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { matchesSearch, milesBetween, shortestRoute } from './popByHelpers';

const searchGlass = require('../../images/whiteSearch.png');
const closeButton = require('../../images/button_close_white.png');
const saveAll = require('./images/saveAll.png');
const unsaveAll = require('./images/removeAll.png');
const routeCircle = require('./images/routeCircle.png');
const routeX = require('./images/routeX.png');
const pinAPlus = require('./images/mapPinAPlus.png');
const pinA = require('./images/mapPinA.png');
const pinB = require('./images/mapPinB.png');
const pinC = require('./images/mapPinC.png');
const pinD = require('./images/mapPinD.png');
const triangleUp = require('./images/triangleUp.png');
const triangleDown = require('./images/triangleDown.png');

type TabType = 'Near Me' | 'Priority' | 'Saved'; // nearby, priority and favorites in API
type MapLength = 'short' | 'medium' | 'long';

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
  const [mapHeight, setMapHeight] = useState<MapLength>('long');
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

  function upPressed() {
    if (mapHeight == 'long') {
      setMapHeight('medium');
    } else if (mapHeight == 'medium') {
      setMapHeight('short');
    }
  }

  function downPressed() {
    if (mapHeight == 'short') {
      setMapHeight('medium');
    } else if (mapHeight == 'medium') {
      setMapHeight('long');
    }
  }

  function getMapHeight() {
    if (mapHeight == 'short') {
      return styles.mapViewShort;
    }
    if (mapHeight == 'medium') {
      return styles.mapViewMedium;
    }
    if (mapHeight == 'long') {
      return styles.mapViewLong;
    }
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
  }, [navigation, mapHeight, tabSelected]);

  useEffect(() => {
    let isMounted = true;
    if (tabSelected == 'Near Me') {
      fetchPopBys('nearby', isMounted);
    } else if (tabSelected == 'Priority') {
      fetchPopBys('priority', isMounted);
    } else {
      fetchPopBys('favorites', isMounted);
    }
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
    fetchPopBys('nearby', true);
  }

  function priorityPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    setTabSelected('Priority');
    fetchPopBys('priority', true);
  }

  function savedPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    setTabSelected('Saved');
    fetchPopBys('favorites', true);
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
      handleShortestRoute(popByData);
    } else {
      handleClosestToFarthest();
    }
    setShowRoute(!showRoute);
  }

  function handleShortestRoute(popByData: PopByRadiusDataProps[]) {
    var route = shortestRoute(popByData);
    console.log('shortest route: ' + route);
    var orderedList = popByData;
    orderedList[0] = popByData[0];
    for (var i = 1; i < orderedList.length; i++) {
      // orderedList[i] = popByData[route[i]];
    }
    // console.log('orderedList: ' + orderedList);
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
    Alert.alert(
      'Are you sure you want to save these relationships?',
      '',
      [
        {
          text: 'Save',
          onPress: () => saveAllPressedContinue(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function unSaveAllPressed() {
    Alert.alert(
      'Remove all relationships?',
      '',
      [
        {
          text: 'Remove',
          onPress: () => unSaveAllPressedContinue(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  function saveAllPressedContinue() {
    console.log('save all pressed');
    setIsLoading(true);
    popByData.forEach(async (item, index) => {
      await savePop(item.id);
      console.log('save pop ' + item.id);
    });
    fetchPopBys('favorites', true);
  }

  function unSaveAllPressedContinue() {
    console.log('unsave all pressed');
    setIsLoading(true);
    popByData.forEach(async (item, index) => {
      await removePop(item.id);
      console.log('removePop ' + item.id);
    });
    fetchPopBys('favorites', true);
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
    if (showRoute) {
      return routeX;
    }
    return routeCircle;
  }

  function getUpArrowStyle() {
    if (mapHeight == 'short') return styles.upAndDownButtonsDim;
    return styles.upAndDownButtons;
  }

  function getDownArrowStyle() {
    if (mapHeight == 'long') return styles.upAndDownButtonsDim;
    return styles.upAndDownButtons;
  }

  function getSavedButton() {
    if (tabSelected == 'Near Me' || tabSelected == 'Priority') {
      return saveAll;
    }
    return unsaveAll;
  }

  function fetchPopBys(type: string, isMounted: boolean) {
    console.log('type: ' + type);
    setIsLoading(true);
    getPopByRadiusData(type)
      .then((res) => {
        if (!isMounted) {
          return false;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setPopByData(res.data);
          //   console.log('length: ' + res.data.length);
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

      <View style={styles.actionAndFilterButtonView}>
        <View style={styles.actionButtonView}>
          {tabSelected == 'Saved' && (
            <TouchableOpacity onPress={toggleRouteButton}>
              <Image source={getRouteButton()} style={styles.actionButtons} />
            </TouchableOpacity>
          )}
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

      {!isLoading && (
        <View style={getMapHeight()}>
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
                  description={
                    person.lastPopbyDate != null ? 'Last PopBy: ' + person.lastPopbyDate : 'Last PopBy: None'
                  }
                />
              ) : (
                <View></View>
              )
            )}
          </MapView>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <View style={styles.searchRow}>
            <TouchableOpacity style={styles.upAndDownView} onPress={upPressed}>
              <View style={styles.upAndDownView}>
                <Image source={triangleUp} style={getUpArrowStyle()} />
              </View>
            </TouchableOpacity>
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
            </View>
            <View style={styles.closeXView}>
              <TouchableOpacity onPress={clearSearchPressed}>
                <Image source={closeButton} style={styles.closeX} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.upAndDownView} onPress={downPressed}>
              <View style={styles.upAndDownView}>
                <Image source={triangleDown} style={getDownArrowStyle()} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {tabSelected == 'Near Me' && (
              <View>
                {popByData.map(
                  (item, index) =>
                    matchesRankFilter(item.ranking) &&
                    matchesSearch(item, search) &&
                    !item.distance.includes('-') && (
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
                    matchesSearch(item, search) &&
                    !item.distance.includes('-') && (
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
                    matchesSearch(item, search) &&
                    !item.distance.includes('-') &&
                    item.address.isFavorite == 'True' && (
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
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 40,
  },
  upAndDownView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchView: {
    backgroundColor: '#1a6295',
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
  },
  magGlass: {
    width: 20,
    height: 20,
    paddingLeft: 5,
    marginTop: 9,
  },
  textInput: {
    fontSize: 16,
    color: 'white',
    paddingLeft: 10,
  },
  closeXView: {
    backgroundColor: '#1a6295',
    width: '5%',
    height: 40,
    paddingRight: 30,
  },
  closeX: {
    width: 15,
    height: 15,
    marginTop: 12,
  },
  actionAndFilterButtonView: {
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
  upAndDownButtons: {
    width: 24,
    height: 24,
    opacity: 1.0,
  },
  upAndDownButtonsDim: {
    width: 24,
    height: 24,
    opacity: 0.4,
  },
  mapViewShort: {
    height: '0%',
    width: '100%',
  },
  mapViewMedium: {
    height: '50%',
    width: '100%',
  },
  mapViewLong: {
    height: '80%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
