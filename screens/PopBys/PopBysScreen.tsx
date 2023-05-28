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
  Modal,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import PopByRow from './PopByRow';
import PopByRowSaved from './PopByRowSaved';
import { getPopBysInWindow } from './api';
import { PopByRadiusDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import React from 'react';
import { storage } from '../../utils/storage';
import MapView, { LatLng, Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { matchesSearch, milesBetween, shortestRoute } from './popByHelpers';
import * as Location from 'expo-location';
import { scheduleNotifications, getNotificationStatus } from '../../utils/general';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';
import QuickSearch from '../QuickAddAndSearch/QuickSearch';

const LOCATION_TASK_NAME = 'background-location-task';
var northEast: LatLng | null = null;
var southWest: LatLng | null = null;

var newRoute: PopByRadiusDataProps[] = [];
var locationCallBack: { remove: any };

const searchGlass = require('../../images/whiteSearch.png');
const quickAdd = require('../../images/addWhite.png');
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
  const [lightOrDark, setLightOrDark] = useState('');
  const [mapRef, updateMapRef] = useState<MapView>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [needToZoomMap, setNeedToZoomMap] = useState(true);
  const popByDataRef = useRef(popByData);
  const [quickSearchVisible, setQuickSearchVisible] = useState(false);

  popByDataRef.current = popByData;

  const requestPermissions = async () => {
    console.log('-----------------------------------');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      nearPressed();
      locationCallBack = await Location.watchPositionAsync(
        {
          distanceInterval: 800, //approx 0.5 miles
          timeInterval: 60000, // must wait 60 seconds before receiving updates
        },
        (newLocation) => {
          console.log('new location ' + newLocation.coords.latitude);
          setLocation(newLocation);
          calculateAndNotify(newLocation, popByDataRef.current, true);
        }
      );
    }
  };

  function searchPressed() {
    console.log('search pressed');
    setQuickSearchVisible(true);
  }

  function quickAddPressed() {
    console.log('quick add pressed');
    navigation.navigate('QuickAdd', {
      person: null,
      source: 'Transactions',
      lightOrDark: lightOrDark,
    });
  }

  async function calculateAndNotify(loc: Location.LocationObject, data: PopByRadiusDataProps[], notify: boolean) {
    var notifOn = await getNotificationStatus('notifPopBys');
    var alreadyScheduled = false;
    //console.log('calculateAndNotify: ' + loc.coords.latitude);
    var tempArray: PopByRadiusDataProps[] = [];

    for (var i = 0; i < data.length; i++) {
      var t: PopByRadiusDataProps = data[i];

      var lon = parseFloat(data[i].location.longitude);
      var lat = parseFloat(data[i].location.latitude);

      if (!isNaN(lon) && !isNaN(lat)) {
        var mb = milesBetween(lon, lat, loc.coords.longitude, loc.coords.latitude);

        t.distance = mb.toFixed(1);
        //   console.log('calculating ' + mb.toFixed(1));
        if (
          mb <= 5 &&
          !alreadyScheduled &&
          !data[i].notified &&
          data[i].ranking == 'A+' &&
          (await enoughTimePassedRel(data[i].id, 30)) &&
          (await enoughTimePassedNotif(60))
        ) {
          t.notified = true;
          alreadyScheduled = true;
          if (notify && notifOn) {
            scheduleNotifications(
              'popby-notification',
              'Pop-By Opportunity!',
              data[i].firstName + ' ' + data[i].lastName + ' is ' + mb.toFixed(1) + ' miles from you!',
              2
            );
          }
        }
        tempArray.push(t);
      }
    }
    if (tabSelected != 'Saved') {
      console.log('update pop by data with new distances: ' + showRoute);
      tempArray.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else {
      if (showRoute) {
        tempArray.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      }
    }
    setPopByData(tempArray);
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
    ga4Analytics('PopBy_Row', {
      contentType: tabSelected,
      itemId: 'id1104',
    });
    navigation.navigate('RelDetails', {
      contactId: popByData[index].id,
      firstName: popByData[index].firstName,
      lastName: popByData[index].lastName,
      rankFromAbove: popByData[index].ranking,
      lightOrDark: lightOrDark,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Pop-By',
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <View style={globalStyles.searchAndAdd}>
          <TouchableOpacity onPress={searchPressed}>
            <Image source={searchGlass} style={globalStyles.searchGlass} />
          </TouchableOpacity>
          <TouchableOpacity onPress={quickAddPressed}>
            <Image source={quickAdd} style={globalStyles.searchGlass} />
          </TouchableOpacity>
        </View>
      ),
      tab: tabSelected,
    });
  }, [navigation, tabSelected]);

  async function stopWatchPositionAsync() {
    console.log('STOPWATCHPOSITION');
    return locationCallBack?.remove();
  }

  useEffect(() => {
    requestPermissions();
    return function cleanup() {
      stopWatchPositionAsync();
    };
  }, []);

  useEffect(() => {
    console.log(location);
    if (needToZoomMap && location) {
      if (mapRef) {
        mapRef.animateToRegion({
          latitude: location!.coords.latitude,
          longitude: location!.coords.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
        setNeedToZoomMap(false);
      }
    }
  }, [location]);

  function centerMap() {
    console.log('center map: ' + location);
    if (location) {
      if (mapRef) {
        mapRef.animateToRegion({
          latitude: location!.coords.latitude,
          longitude: location!.coords.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
        setNeedToZoomMap(false);
      }
    }
  }

  function matchesRankFilter(ranking: string) {
    if (ranking == 'A+' && showAPlus) return true;
    if (ranking == 'A' && showA) return true;
    if (ranking == 'B' && showB) return true;
    if (ranking == 'C' && showC) return true;
    return false;
  }

  function nearPressed() {
    ga4Analytics('PopBy_Near_Me_Tab', {
      contentType: 'none',
      itemId: 'id1101',
    });
    if (isLoading) {
      return;
    }
    setInfoText('Closest to Farthest');
    setShowRoute(false);
    const tab = 'Near Me';
    setTabSelected(tab);
    fetchPopBysWindow(tabToParam(tab), 'none', true);
  }

  function priorityPressed() {
    ga4Analytics('PopBy_Priority_Tab', {
      contentType: 'none',
      itemId: 'id1102',
    });
    setInfoText('Closest to Farthest');
    setShowRoute(false);
    if (isLoading) {
      return;
    }
    const tab = 'Priority';
    setTabSelected(tab);
    fetchPopBysWindow(tabToParam(tab), 'none', true);
  }

  function savedPressed() {
    ga4Analytics('PopBy_Saved_Tab', {
      contentType: 'none',
      itemId: 'id1103',
    });
    setInfoText('Closest to Farthest');
    setShowRoute(false);
    if (isLoading) {
      return;
    }
    const tab = 'Saved';
    setShowRoute(false);
    setTabSelected(tab);
    console.log('TAB: ' + tab);
    fetchPopBysWindow(tabToParam(tab), 'none', true);
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
      // return;
    }
    if (showRoute) {
      // these seem reversed but they aren't since showRoute isn't toggled til the end of this function.
      ga4Analytics('PopBy_Closest_To_Farthest', {
        contentType: 'none',
        itemId: 'id1108',
      });
      fetchPopBysWindow(tabToParam(tabSelected), 'none', true);
      setInfoText('Closest to Farthest');
      console.log('SHOWROUTE1: ' + showRoute);
    } else {
      ga4Analytics('PopBy_Shortest_Route', {
        contentType: 'none',
        itemId: 'id1107',
      });
      fetchPopBysWindow(tabToParam(tabSelected), 'none', true);
      handleShortestRoute(popByData);
      setInfoText('Minimized Route Distance');
      console.log('SHOWROUTE2: ' + showRoute);
    }
    setShowRoute(!showRoute);
  }

  function handleShortestRoute(popByData: PopByRadiusDataProps[]) {
    if (popByData.length < 4) {
      Alert.alert('Please show at least 4 relationships for the shortest route to be calculated.');
    } else {
      var numNodes = popByData.length;
      if (numNodes > 10) {
        numNodes = 10;
      }
      var route = shortestRoute(popByData);
      newRoute = [];
      newRoute.push(popByData[0]);
      for (var i = 1; i < numNodes; i++) {
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
  } // branch

  function handleRegionChange(region: Region) {
    console.log('HANDLEREGIONCHANGE----------------------------------');
    if (tabSelected == 'Near Me' || tabSelected == 'Priority' || (tabSelected == 'Saved' && !showRoute)) {
      console.log('REGION: ' + region);
      mapRef
        ?.getMapBoundaries()
        .then((res) => {
          console.log(res);
          console.log(northEast);

          if (
            Math.abs(res.northEast.latitude - (northEast?.latitude ?? 0)) > 0.1 ||
            Math.abs(res.northEast.longitude - (northEast?.longitude ?? 0)) > 0.1
          ) {
            northEast = res.northEast;
            southWest = res.southWest;
            //   console.log('REGIONCHANGE');
            fetchPopBysWindow(tabToParam(tabSelected), 'none', true);
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
    var message = 'A';
    if (popByData.length == 0) {
      message = 'There are no relationships to save';
    } else if (popByData.length == 1) {
      ('Are you sure you want to save this relationship');
    } else {
      message = 'Are you sure you want to save these ' + popByData.length + ' relationships?';
    }
    Alert.alert(
      message,
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
    ga4Analytics('PopBy_Save_All', {
      contentType: tabSelected,
      itemId: 'id1105',
    });
    if (popByData.length == 0) {
      Alert.alert('No relationships to save');
      return;
    }
    console.log('TABSELECTED: ' + tabSelected);
    fetchPopBysWindow(tabToParam(tabSelected), 'save', true);
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
    ga4Analytics('PopBy_Unsave_All', {
      contentType: 'none',
      itemId: 'id1106',
    });
    if (popByData.length == 0) {
      Alert.alert('No relationships to remove');
      return;
    }
    fetchPopBysWindow(tabToParam(tabSelected), 'remove', true);
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

  function shouldShowRow(index: number) {
    if (showRoute) {
      if (index < 11) {
        return true;
      }
      return false;
    }
    return true;
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

  async function fetchPopBysWindow(type: string, task: string, isMounted: boolean) {
    if (southWest == null || northEast == null) {
      console.log('no coordinates');
      return;
    }
    //don't show spinner if there is already data on screen, it's just too distracting
    if (popByData == null) setIsLoading(true);
    getPopBysInWindow(
      type,
      southWest!.latitude.toString(),
      northEast!.longitude.toString(),
      northEast!.latitude.toString(),
      southWest!.longitude.toString(),
      task
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
          //console.log('RESDATA:' + res.data.length);
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
      })
      .catch((error) => console.error('failure ' + error));
  }

  if (isLoading) {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.activityIndicatorDark : globalStyles.activityIndicatorLight}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
          <View style={globalStyles.tabButtonRow}>
            <Text
              style={tabSelected == 'Near Me' ? globalStyles.selected : globalStyles.unselected}
              onPress={nearPressed}
            >
              Near Me
            </Text>
            <Text
              style={tabSelected == 'Priority' ? globalStyles.selected : globalStyles.unselected}
              onPress={priorityPressed}
            >
              Priority
            </Text>
            <Text
              style={tabSelected == 'Saved' ? globalStyles.selected : globalStyles.unselected}
              onPress={savedPressed}
            >
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

          <View style={getMapHeight()}>
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
              onRegionChangeComplete={handleRegionChange}
            >
              {popByData.map((person, index) =>
                matchesRankFilter(person.ranking) && matchesSearch(person, search) ? (
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
            <TouchableOpacity onPress={centerMap} style={styles.bottomView}>
              <Image source={saveAll} style={styles.centerButton} />
            </TouchableOpacity>
          </View>

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
                      <PopByRow
                        popByTab={'Near Me'}
                        key={index}
                        data={item}
                        lightOrDark={lightOrDark}
                        onPress={() => handleRowPress(index)}
                      />
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
                      <PopByRow
                        popByTab={'Priority'}
                        key={index}
                        data={item}
                        lightOrDark={lightOrDark}
                        onPress={() => handleRowPress(index)}
                      />
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
                    shouldShowRow(index) &&
                    item.address.isFavorite == 'True' && (
                      <PopByRowSaved
                        popByTab={'Saved'}
                        key={index}
                        data={item}
                        lightOrDark={lightOrDark}
                        onPress={() => handleRowPress(index)}
                        refresh={() => savedPressed()}
                      />
                    )
                )}
              </View>
            )}
          </ScrollView>
          {quickSearchVisible && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={quickSearchVisible}
              onRequestClose={() => {
                setQuickSearchVisible(!quickSearchVisible);
              }}
            >
              <QuickSearch title={'Quick Search'} setModalVisible={setQuickSearchVisible} lightOrDark={lightOrDark} />
            </Modal>
          )}
        </View>
      </>
    );
  }
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
    paddingLeft: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoViewLight: {
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
  centerButton: {
    width: 40,
    height: 40,
    right: 20,
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
    height: '70%',
    width: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
});
