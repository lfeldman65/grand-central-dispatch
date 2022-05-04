import { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Button from '../../components/Button';

import { getVideoSummaryData } from './api';
import { VideoSummaryDataProps } from './interfaces';

import { analytics } from '../../utils/analytics';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import RecentActivityRow from './RecentActivityRow';
import VideoHistoryRow from './VideoHistoryRow';

// interface RolodexScreenProps {
//   route: RouteProp<any>;
// }

//export default function ManageRelationshipsScreen(props: RolodexScreenProps) {
export default function VideoHistoryScreen() {
  let deviceWidth = Dimensions.get('window').width;

  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [dataVid, setDataVid] = useState<VideoSummaryDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    analytics.event(new Event('Video Summary', 'Row', 'Press', 0));
    console.log('Row Pressed');

    // navigation.navigate('RelationshipDetailScreen', {});
    // navigation.navigate('RelationshipDetailScreen', {
    //   //  contactId: data[index]['contactId'],
    // });
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, []);

  useEffect(() => {
    getThatData();
  }, []);

  //useEffect(() => {}); // this will run on every rendeer

  function saveComplete() {
    console.log('Save Complete');
  }

  function getThatData() {
    setIsLoading(true);
    console.log('yep');
    getVideoSummaryData()
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataVid(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            <View>
              {dataVid.map((item, index) => (
                <VideoHistoryRow key={index} data={item} onPress={() => handleRowPress(index)} />
              ))}
            </View>
          </ScrollView>
        </React.Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  chevron: {
    marginRight: 20,
    marginTop: 5,
    height: 15,
    width: 27,
  },
  filterButton: {
    height: 40,
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#1C6597',
  },
});
