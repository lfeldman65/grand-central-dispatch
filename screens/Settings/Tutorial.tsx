import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SlidingDot } from 'react-native-animated-pagination-dots';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
const goals = require('../Settings/images/goals.png');
const dashboard = require('../Settings/images/dashboard.png');
const pac1 = require('../Settings/images/pac1.png');
const pac2 = require('../Settings/images/pac2.png');
const rel1 = require('../Settings/images/rel1.png');
const rel2 = require('../Settings/images/rel2.png');
const tx1 = require('../Settings/images/tx1.png');
const tx2 = require('../Settings/images/tx2.png');
const pop1 = require('../Settings/images/pop1.png');
const pop2 = require('../Settings/images/pop2.png');
const blank = require('../../images/blankSearch.png');

interface ItemProps {
  key: string;
  title: string;
  description: string;
  imageName: ImageSourcePropType;
}

const INTRO_DATA = [
  {
    key: '1',
    title: 'Welcome to Referral Maker CRM',
    description: 'Set your business goals and track your progress from a single screen. Try to win the day and week!',
    imageName: goals,
  },
  {
    key: '2',
    title: 'Dashboard',
    description: 'Access major features from a convenient Dashboard.',
    imageName: dashboard,
  },
  {
    key: '3',
    title: 'Priority Action Center',
    description:
      'Take the guesswork out of your day with preloaded activities telling you who to call, who to write a note to, and who to go see. Use quick swipes to complete or postpone activities.',
    imageName: pac1,
  },
  {
    key: '4',
    title: 'Priority Action Center',
    description: "Relationship activity details are easily viewed by tapping the relationship's name.",
    imageName: pac2,
  },
  {
    key: '5',
    title: 'Relationships',
    description: 'Scroll through your database in the Relationships list.',
    imageName: rel1,
  },
  {
    key: '6',
    title: 'Relationships',
    description:
      'Easily reach out to relationships through their profile. Tap on the icons to send a text, make a call, send a video, compose an email, or get directions.',
    imageName: rel2,
  },
  {
    key: '7',
    title: 'Transactions',
    description:
      'Use a quick swipe left to change the status of your transaction while you progress towards closing the deal!',
    imageName: tx2,
  },
  {
    key: '8',
    title: 'Transactions',
    description: 'Add new transactions by filling out all of the transaction details.',
    imageName: tx1,
  },
  {
    key: '9',
    title: "Pop-By's",
    description:
      'Advanced mapping technology lets you know who is around you for easy visits. Tap the rank pins along the top to show or hide relationships based on ranking.',
    imageName: pop1,
  },
  {
    key: '10',
    title: "Pop-By's",
    description:
      "Save the relationships that you wish to visit. Tap on the route icon to list the saved Pop-By's in an order that will minimize your route distance.",
    imageName: pop2,
  },
  {
    key: '11',
    title: 'Tap the Done button to get started!',
    description: '',
    imageName: blank,
  },
];

const sliderMargin = 0;

export default function Tutorial(props: any) {
  const { width } = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const renderItem = React.useCallback(
    ({ item }: { item: ItemProps }) => {
      return (
        <View style={[styles.itemContainer, { width: width - 2 * sliderMargin }]}>
          <Text style={styles.titleStyle}>{item.title}</Text>
          <Animated.Text style={styles.textStyle}>{item.description}</Animated.Text>
          <Image source={item.imageName} style={styles.image}></Image>
        </View>
      );
    },
    [width]
  );
  const keyExtractor = React.useCallback((item: ItemProps) => item.key, []);
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Tutorial',
      // headerLeft: () => (
      //   <TouchableOpacity onPress={backPressed}>
      //     <Text style={styles.backAndSkip}>Back</Text>
      //   </TouchableOpacity>
      // ),
      headerRight: () => (
        <TouchableOpacity onPress={skipPressed}>
          <Text style={styles.backAndSkip}>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function backPressed() {
    navigation.goBack();
  }

  function skipPressed() {
    navigation.goBack();
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        data={INTRO_DATA}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        style={styles.flatList}
        pagingEnabled
        horizontal
        decelerationRate={'normal'}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />
      <View style={styles.text}>
        <View style={styles.dotContainer}>
          <SlidingDot
            marginHorizontal={3}
            containerStyle={styles.constainerStyles}
            data={INTRO_DATA}
            scrollX={scrollX}
            dotSize={12}
            dotStyle={styles.dotStyle}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A6295',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  dotStyle: {
    backgroundColor: 'white',
    opacity: 1.0,
  },
  text: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  titleStyle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    paddingRight: 20,
    marginTop: 10,
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    paddingRight: 12,
  },
  flatList: {
    height: '80%',
  },
  dotContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  dotStyles: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  image: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
  constainerStyles: {
    top: 10,
  },
  itemContainer: {
    // backgroundColor: 'red',
    alignItems: 'center',
    padding: '3%',
    //  marginHorizontal: sliderMargin,
    height: '100%',
    //  borderRadius: 20,
  },
  backAndSkip: {
    color: 'white',
    fontSize: 18,
    opacity: 1.0,
  },
});
