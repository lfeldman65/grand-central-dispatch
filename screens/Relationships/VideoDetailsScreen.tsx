import { Fragment, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { getVideoDetails } from './api';
import { VideoDetailsDataProps } from './interfaces';
import React from 'react';
import VideoDetailsRow from './VideoDetailsRow';
import globalStyles from '../../globalStyles';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { ga4Analytics } from '../../utils/general';

export default function VideoDetailsScreen(props: any) {
  const { route } = props;
  const { videoGuid, videoTitle } = route.params;
  const [lightOrDark, setLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [dataVid, setDataVid] = useState<VideoDetailsDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    ga4Analytics('Video_History_Details_Row', {
      contentType: 'none',
      itemId: 'id0702',
    });
    console.log(dataVid[index].contactGuid);
    console.log('name: ' + dataVid[index].fullName);
    if (dataVid[index].contactGuid != null && dataVid[index].fullName != '') {
      navigation.navigate('RelDetails', {
        contactId: dataVid[index].contactGuid,
        firstName: dataVid[index].fullName,
        lastName: '',
        lightOrDark: lightOrDark,
      });
    } else {
      console.log('herebaby');
    }
  };

  useEffect(() => {
    getThatData();
    console.log(videoGuid);
    navigation.setOptions({ title: videoTitle });
  }, []);

  //useEffect(() => {}); // this will run on every rendeer

  function getThatData() {
    setIsLoading(true);
    getVideoDetails(videoGuid)
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
          <React.Fragment>
            <ScrollView>
              <View>
                {dataVid.map((item, index) => (
                  <VideoDetailsRow
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
