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
import { getVideoDetails } from './api';
import { VideoDetailsDataProps } from './interfaces';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import RecentActivityRow from './RecentActivityRow';
import VideoDetailsRow from './VideoDetailsRow';
import { storage } from '../../utils/storage';
import globalStyles from '../../globalStyles';

export default function VideoDetailsScreen(props: any) {
  const { route } = props;
  const { videoGuid, videoTitle } = route.params;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [dataVid, setDataVid] = useState<VideoDetailsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  const handleRowPress = (index: number) => {
    //  analytics.event(new Event('Video Details', 'Row', 'Press', 0));
    console.log('Vid Details Row Pressed');
  };

  useEffect(() => {
    console.log(videoGuid);
    navigation.setOptions({ title: videoTitle });
  }, []);

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            <View>
              {dataVid.map((item, index) => (
                <VideoDetailsRow key={index} data={item} onPress={() => handleRowPress(index)} />
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
