import { Fragment, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { getVideoSummaryData } from './api';
import { VideoSummaryDataProps } from './interfaces';
import React from 'react';
import VideoHistoryRow from './VideoHistoryRow';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';

export default function VideoHistoryScreen() {
  const [lightOrDark, setLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [dataVid, setDataVid] = useState<VideoSummaryDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    ga4Analytics('Video_History_Summary_Row', {
      contentType: 'none',
      itemId: 'id0701',
    });
    navigation.navigate('VideoDetailsScreen', {
      videoGuid: dataVid[index].videoGuid,
      videoTitle: dataVid[index].videoTitle,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  }, [navigation]);

  useEffect(() => {
    getThatData();
  }, [isFocused]);

  //useEffect(() => {}); // this will run on every render

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

  if (isLoading) {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
        <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
          <React.Fragment>
            <ScrollView>
              <View>
                {dataVid.map((item, index) => (
                  <VideoHistoryRow
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            </ScrollView>
          </React.Fragment>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
