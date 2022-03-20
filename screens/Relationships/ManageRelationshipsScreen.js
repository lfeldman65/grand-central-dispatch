import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import Button from '../../components/Button';

import chevron from '../../assets/chevron_blue.png';
import { analytics } from '../../utils/analytics';

//type TabType = 'a-z' | 'ranking' | 'groups';

// interface RolodexScreenProps {
//   route: RouteProp<any>;
// }

//export default function ManageRelationshipsScreen(props: RolodexScreenProps) {

export default function ManageRelationshipsScreen() {
  let deviceWidth = Dimensions.get('window').width;

  // const [tabSelected, setTabSelected] = useState(props.route.params?.defaultTab ?? 'A-Z');
  const [tabSelected, setTabSelected] = useState('a-z');

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFilterRel, setIsFilterRel] = useState(true);

  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  useEffect(() => {
    fetchPressed(tabSelected);
  }, [isFocused]);

  useEffect(() => {
    showFilterTitle();
  }, [isFilterRel]);

  // useEffect(() => {
  //   showFilterTitle(!filterTitle);
  // }, [isFocused]);

  function showFilterTitle() {
    if (isFilterRel) {
      return 'Relationships';
    }
    return 'Businesses';
  }

  function handleAddRelPressed() {
    console.log('Add Rel Pressed');
  }

  function azPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'A-Z', 0));
    setTabSelected('a-z');
    fetchPressed('alpha');
  }

  function rankingPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0));
    setTabSelected('ranking');
    fetchPressed('ranking');
  }

  function groupsPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0));
    setTabSelected('groups');
    fetchPressed('groups');
  }

  function filterPressed() {
    console.log('filter');
    analytics.event(new Event('Manage Relationships', 'Filter', 'Press', 0));
    if (isFilterRel) {
      setIsFilterRel(false);
    } else {
      setIsFilterRel(true);
      showFilterTitle();
    }
  }

  function sanityCheck() {
    if (data == null) {
      return false;
    }

    if (data['data'] == null) {
      return false;
    }

    if (data['data'].length == 0) {
      return false;
    }
    return true;
  }

  function shouldDisplay(index) {
    if (!sanityCheck()) return false;

    return true;
  }

  function fetchPressed(type) {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    var azOrRankingURL =
      'https://www.referralmaker.com/services/mobileapi/contacts?sortType=' + type + '&lastItem=0&batchSize=1';
    var groupURL = 'https://www.referralmaker.com/services/mobileapi/groups?lastItem=0&batchSize=10';
    var apiURL = azOrRankingURL;
    if (type == 'groups') {
      apiURL = groupURL;
    }

    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        console.log(result);
        setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          //  navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.tabButtonRow}>
        <Text style={tabSelected == 'a-z' ? styles.selected : styles.unselected} onPress={azPressed}>
          A-Z
        </Text>
        <Text style={tabSelected == 'ranking' ? styles.selected : styles.unselected} onPress={rankingPressed}>
          Ranking
        </Text>
        <Text style={tabSelected == 'groups' ? styles.selected : styles.unselected} onPress={groupsPressed}>
          Groups
        </Text>
      </View>
      <View style={styles.filterBox}>
        <TouchableOpacity onPress={filterPressed}>
          <Text style={styles.spacing}>spacing</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={filterPressed}>
          <Text style={styles.filterText}>{isFilterRel ? 'Relationships' : 'Businesses'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={filterPressed}>
          <Image source={chevron} style={styles.chevron} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {data['data'].map((name, index) =>
          shouldDisplay(index) ? (
            <View key={index}>
              <Text style={styles.filterText}>{isFilterRel ? 'Relationships' : 'Businesses'}</Text>
            </View>
          ) : (
            <View></View>
          )
        )}
      </ScrollView>
      <TouchableOpacity style={styles.bottomContainer} onPress={() => handleAddRelPressed()}>
        <View style={styles.addButton}>
          <Text style={styles.addText}>Add Relationships</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
  },
  spacing: {
    color: 'white',
    backgroundColor: 'white',
  },
  invisible: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  chevron: {
    marginRight: 20,
    marginTop: 5,
    height: 15,
    width: 27,
  },
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 18,
    color: 'black',
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 10,
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 10,
    borderColor: 'lightblue',
    borderWidth: 2,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  addText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
  },
});
