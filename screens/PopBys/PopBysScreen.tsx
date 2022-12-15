import { useRef, useState } from 'react';
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
import { useNavigation, useIsFocused, RouteProp, DarkTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { Event } from 'expo-analytics';
import PopByRow from './PopByRow';
import PopByRowSaved from './PopByRowSaved';
import { getPopByRadiusData, getPopBysInWindow, savePop, removePop, saveOrRemovePopBulk } from './api';
import { PopByRadiusDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import React from 'react';
import { storage } from '../../utils/storage';
import MapView, { LatLng, Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { matchesSearch, milesBetween, shortestRoute } from './popByHelpers';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { scheduleNotifications } from '../../utils/general';

const LOCATION_TASK_NAME = 'background-location-task';
var northEast: LatLng | null = null;
var southWest: LatLng | null = null;

var newRoute: PopByRadiusDataProps[] = [];
var locationCallBack: { remove: any };

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

const chevronUp = require('../../images/chevron_blue_up.png');
const chevronDown = require('../../images/chevron_blue_down.png');

type TabType = 'Near Me' | 'Priority' | 'Saved'; // nearby, priority and favorites in API
type MapLength = 'short' | 'medium' | 'long';

export default function ManageRelationshipsScreen() {
  const [tabSelected, setTabSelected] = useState<TabType>('Near Me');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [popByData, setPopByData] = useState<PopByRadiusDataProps[]>([]);
  const [infoText, setInfoText] = useState('Closest to farthest');
  const [showAPlus, setShowAPlus] = useState(true);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showC, setShowC] = useState(true);
  const [search, setSearch] = useState('');
  const [mapHeight, setMapHeight] = useState<MapLength>('medium');
  const [showRoute, setShowRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [mapRef, updateMapRef] = useState<MapView>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  //var location: Location.LocationObject | null = null;
  const popByDataRef = useRef(popByData);
  popByDataRef.current = popByData;

  //const locationRef = useRef(location);
  //locationRef.current = location;

  async function getDarkOrLightMode(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      console.log('granted');
      locationCallBack = await Location.watchPositionAsync(
        {
          distanceInterval: 800, //approx 0.5 miles
          timeInterval: 10000, // must wait 10 seconds before receiving updates
        },
        (newLocation) => {
          console.log('new location ' + newLocation.coords.latitude);
          setLocation(newLocation);
          calculateAndNotify(newLocation, popByDataRef.current, true);
        }
      );
    }
  };

  async function calculateAndNotify(loc: Location.LocationObject, data: PopByRadiusDataProps[], notify: boolean) {
    var alreadyScheduled = false;
    console.log('calculateAndNotify: ' + loc.coords.latitude);

    for (var i = 0; i < data.length; i++) {
      var lon = parseFloat(data[i].location.longitude);
      var lat = parseFloat(data[i].location.latitude);

      if (!isNaN(lon) && !isNaN(lat)) {
        var mb = milesBetween(lon, lat, loc.coords.longitude, loc.coords.latitude);

        data[i].distance = mb.toFixed(1);

        if (
          mb > 5 &&
          !alreadyScheduled &&
          !data[i].notified &&
          true && // data[i].ranking == 'A+' &&
          (await enoughTimePassedRel(data[i].id, 30)) &&
          (await enoughTimePassedNotif(60))
        ) {
          data[i].notified = true;
          alreadyScheduled = true;
          if (notify) {
            scheduleNotifications(
              'Pop-By Opportunity!',
              data[i].firstName + ' ' + data[i].lastName + ' is ' + mb.toFixed(1) + ' miles from you!',
              2
            );
          }
        }
      }
    }
    console.log('DATALENGTH: ' + data.length);
    setPopByData(data);
  }

  async function enoughTimePassedRel(guid: string, daysBetween: number) {
    // same relationship must have at least x days between notifications
    var now = Date.now();
    const lastNotifForRel = await storage.getItem(guid + 'pop');
    if (guid == '44a5777d-8867-49ba-b7b3-02018dde8138') {
      //   console.log('LASTNOTIF PENTANGELLI: ' + lastNotifForRel);
    }
    if (lastNotifForRel == null) {
      if (guid == '44a5777d-8867-49ba-b7b3-02018dde8138') {
        console.log('SAVE PENTAGELLI FIRST TIME: ' + lastNotifForRel);
      }
      storage.setItem(guid + 'pop', now.toString());
      return true;
    }
    const msecBetween = daysBetween * 24 * 3600 * 1000;
    const nextNotif = parseFloat(lastNotifForRel) + msecBetween;
    if (guid == '44a5777d-8867-49ba-b7b3-02018dde8138') {
      //  console.log('NEXTNOTIF: ' + nextNotif.toString());
      //  console.log('NOW2: ' + now);
    }
    if (now > nextNotif) {
      if (guid == '44a5777d-8867-49ba-b7b3-02018dde8138') {
        //  console.log('SAVE PENTAGELLI SECOND TIME: ' + now);
      }
      storage.setItem(guid + 'pop', now.toString());
      return true;
    }
    return false;
  }

  async function enoughTimePassedNotif(secondsBetween: number) {
    // Must have at least y seconds between successive notifications
    var now = Date.now();
    const lastNotif = await storage.getItem('lastPopNotification');
    if (lastNotif == null) {
      storage.setItem('lastPopNotification', now.toString());
      return true;
    }
    const nextNotif = parseFloat(lastNotif) + secondsBetween * 1000;
    //  console.log('LASTNOTIF:' + parseFloat(lastNotif));
    if (now > nextNotif) {
      storage.setItem('lastPopNotification', now.toString());
      return true;
    }
    return false;
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

  async function stopWatchPositionAsync() {
    console.log('STOPWATCHPOSITION');
    return locationCallBack?.remove();
  }

  useEffect(() => {
    requestPermissions();
    let isMounted = true;
    if (tabSelected == 'Near Me') {
      fetchPopBysWindow('nearby', isMounted);
    } else if (tabSelected == 'Priority') {
      fetchPopBysWindow('priority', isMounted);
    } else {
      fetchPopBysWindow('favorites', isMounted);
    }
    return () => {
      console.log('clean up');
      stopWatchPositionAsync();
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
    if (isLoading) {
      //  return;
    }
    const tab = 'Near Me';
    setTabSelected(tab);
    fetchPopBysWindow(tabToParam(tab), true);
  }

  function priorityPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    if (isLoading) {
      //  return;
    }
    const tab = 'Priority';
    setTabSelected(tab);
    fetchPopBysWindow(tabToParam(tab), true);
  }

  function savedPressed() {
    //  analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    if (isLoading) {
      //  return;
    }
    const tab = 'Saved';
    setShowRoute(false);
    setTabSelected(tab);
    fetchPopBysWindow(tabToParam(tab), true);
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
    if (isLoading) {
      return;
    }
    if (showRoute) {
      // these seem reversed but they aren't since showRoute isn't toggled til the end of this function.
      fetchPopBysWindow(tabToParam(tabSelected), true);
      setInfoText('Closest to Farthest');
      console.log('SHOWROUTE1: ' + showRoute);
    } else {
      fetchPopBysRadius(tabToParam(tabSelected), true);
      handleShortestRoute(popByData);
      setInfoText('Minimized Route Distance');
      console.log('SHOWROUTE2: ' + showRoute);
    }
    setShowRoute(!showRoute);
  }

  function handleShortestRoute(popByData: PopByRadiusDataProps[]) {
    console.log('POPBYLENGTH: ' + popByData.length);
    if (popByData.length < 4) {
      Alert.alert('Please show at least 4 relationships for the shortest route to be calculated.');
    } else {
      var route = shortestRoute(popByData);
      newRoute = [];
      newRoute.push(popByData[0]);
      for (var i = 1; i < popByData.length; i++) {
        newRoute.push(popByData[route[i - 1]]);
      }
      for (var i = 0; i < newRoute.length; i++) {
        popByData[i] = newRoute[i];
      }
    }
  }

  function tabToParam(tab: string) {
    if (tab == 'Near Me') {
      return 'nearby';
    }
    if (tab == 'Priority') {
      return 'priority';
    }
    if (tab == 'Saved') {
      return 'favorites';
    }
    return 'nearby';
  }

  function handleRegionChange(region: Region) {
    if (tabSelected == 'Near Me' || tabSelected == 'Priority' || (tabSelected == 'Saved' && !showRoute)) {
      console.log('REGION: ' + region);
      mapRef
        ?.getMapBoundaries()
        .then((res) => {
          console.log(res);
          if (
            Math.abs(res.northEast.latitude - (northEast?.latitude ?? 0)) > 0 ||
            Math.abs(res.northEast.longitude - (northEast?.longitude ?? 0)) > 0
          ) {
            northEast = res.northEast;
            southWest = res.southWest;
            //   console.log('REGIONCHANGE');
            fetchPopBysWindow(tabToParam(tabSelected), true);
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log('REGIONCHANGED-SHORTESTROUTE');
    }
  }

  function saveOrUnsavePressed() {
    if (isLoading) {
      return;
    }
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

  async function saveAllPressedContinue() {
    console.log('save all pressed');
    if (popByData.length == 0) {
      Alert.alert('No relationships to save');
      return;
    }
    // setIsLoading(true);
    var guids = popByData[0].id;
    var i = 0;
    while (i < popByData.length) {
      if (popByData[i].address?.isFavorite == 'False') {
        // guids = guids + ',' + popByData[i].id;
        saveOrRemovePopBulk(guids, 'save')
          .then(async (res) => {
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('failure ' + error);
            setIsLoading(false);
          });
      }
      i = i + 1;
    }
    setIsLoading(true);
    fetchPopBysWindow(tabToParam(tabSelected), true);
    console.log('GUIDS: ' + guids);
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

  function unSaveAllPressedContinue() {
    console.log('unsave all pressed');
    if (popByData.length == 0) {
      Alert.alert('No relationships to remove');
      return;
    }
    // setIsLoading(true);
    var guids = popByData[0].id;
    var i = 1;
    while (i < popByData.length) {
      if (popByData[i].address?.isFavorite == 'True') {
        guids = guids + ',' + popByData[i].id;
      }
      i = i + 1;
    }
    // setIsLoading(true);
    saveOrRemovePopBulk(guids, 'remove');
    fetchPopBysWindow(tabToParam(tabSelected), true);
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
      return routeCircle;
    }
    return routeX;
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

  function fetchPopBysRadius(type: string, isMounted: boolean) {
    console.log('type: ' + type);
    setIsLoading(true);
    if (location !== null) {
      getPopByRadiusData(type, location.coords.latitude.toString(), location.coords.longitude.toString())
        .then((res) => {
          if (!isMounted) {
            return false;
          }
          if (res.status == 'error') {
            console.error(res.error);
          } else {
            setPopByData(res.data);
          }
          setIsLoading(false);
          setInfoText('Minimized Route Distance');
        })
        .catch((error) => console.error('failure ' + error));
    }
  }

  async function fetchPopBysWindow(type: string, isMounted: boolean) {
    console.log('FETCHPOPBYSWINDOW: ' + type);
    console.log('SOUTHWEST:' + southWest);

    if (southWest == null || northEast == null) {
      return;
    }
    setIsLoading(true);
    getPopBysInWindow(
      type,
      southWest!.latitude.toString(),
      northEast!.longitude.toString(),
      northEast!.latitude.toString(),
      southWest!.longitude.toString()
    )
      .then(async (res) => {
        //console.log('BACK:' + res.data);
        if (!isMounted) {
          return false;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setPopByData(res.data);
          console.log('RESDATA:' + res.data.length);
          if (location == null) {
            let loc = await Location.getCurrentPositionAsync({})
              .then((l) => {
                setLocation(l);
                calculateAndNotify(l, res.data, true);
              })
              .catch((error) => console.log('cannot get location ' + error));
          } else {
            calculateAndNotify(location, res.data, false);
          }
        }
        setIsLoading(false);
        setInfoText('Closest to farthest');
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

      {
        /*!isLoading &&*/ <View style={getMapHeight()}>
          <MapView
            ref={(ref) => updateMapRef(ref!)}
            showsUserLocation={true}
            style={styles.map}
            followsUserLocation={tabSelected == 'Saved' && showRoute}
            /*
            initialRegion={{
              //latitude: -37.112146,
              //longitude: 144.857483,

              latitude: popByData?.length == 0 ? 0 : parseFloat(popByData[0].location.latitude),
              longitude: popByData?.length == 0 ? 0 : parseFloat(popByData[0].location.longitude),
              latitudeDelta: 0.11,
              longitudeDelta: 0.06,
            }}*/
            userInterfaceStyle={lightOrDark == 'dark' ? 'dark' : 'light'}
            //   onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChange}
          >
            {popByData.map((person, index) =>
              true ? (
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
      }

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <View style={styles.upAndDownRow}>
            <TouchableOpacity style={styles.upAndDownView} onPress={upPressed}>
              <View>
                <Image source={chevronUp} style={getUpArrowStyle()} />
              </View>
            </TouchableOpacity>
            <View style={lightOrDark == 'dark' ? styles.infoViewDark : styles.infoViewLight}>
              <Text style={lightOrDark == 'dark' ? styles.infoTextDark : styles.infoTextLight}>{infoText}</Text>
            </View>
            <TouchableOpacity style={styles.upAndDownView} onPress={downPressed}>
              <View>
                <Image source={chevronDown} style={getDownArrowStyle()} />
              </View>
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
                    matchesSearch(item, search) &&
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
  searchView: {
    backgroundColor: '#1a6295',
    height: 40,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderColor: 'white',
    borderWidth: 0.5,
    flexDirection: 'row',
    marginTop: 1,
    marginBottom: 1,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 40,
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
  },
  closeX: {
    width: 15,
    height: 15,
    marginTop: 12,
  },
  upAndDownRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 40,
  },
  upAndDownView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoViewDark: {
    //  backgroundColor: 'black',
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoViewLight: {
    //  backgroundColor: 'white',
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextDark: {
    color: 'white',
    paddingTop: 4,
    fontSize: 16,
  },
  infoTextLight: {
    color: 'black',
    paddingTop: 4,
    fontSize: 16,
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
    width: 25,
    height: 15,
    opacity: 1.0,
  },
  upAndDownButtonsDim: {
    width: 25,
    height: 15,
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
    height: '77%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
