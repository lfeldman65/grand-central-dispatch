import React from 'react';
import { StyleSheet, View, Text, Animated, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SlidingDot } from 'react-native-animated-pagination-dots';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

interface ItemProps {
  key: string;
  title: string;
  description: string;
}

const INTRO_DATA = [
  {
    key: '1',
    title: 'App showcase ✨',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    key: '2',
    title: 'Introduction screen 🎉',
    description:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
  },
  {
    key: '3',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
  {
    key: '4',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
  {
    key: '5',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
  {
    key: '6',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
];

export default function Tutorial1(props: any) {
  const { width } = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const renderItem = React.useCallback(
    ({ item }: { item: ItemProps }) => {
      return (
        <View style={[styles.itemContainer, { width: width - 80 }]}>
          <Text>{item.title}</Text>
          <Animated.Text>{item.description}</Animated.Text>
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
      headerLeft: () => (
        <TouchableOpacity onPress={backPressed}>
          <Text style={styles.backAndNext}>Back</Text>
        </TouchableOpacity>
      ),
      //   headerRight: () => (
      //     <TouchableOpacity onPress={nextPressed}>
      //       <Text style={styles.backAndNext}>Next</Text>
      //     </TouchableOpacity>
      //   ),
    });
  }, [navigation]);

  function backPressed() {
    navigation.goBack();
  }

  function nextPressed() {
    navigation.navigate('SettingsScreen');
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
  },
  dotStyle: {
    backgroundColor: 'white',
    opacity: 1.0,
  },
  text: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  flatList: {
    // flex: 1,
    height: '60%',
  },
  dotContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dotStyles: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  constainerStyles: {
    top: 30,
  },
  itemContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
    marginHorizontal: 40,
    borderRadius: 20,
  },
  backAndNext: {
    color: 'white',
    fontSize: 18,
    opacity: 1.0,
  },
});
