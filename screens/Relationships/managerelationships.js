import { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking, ScrollView, ActivityIndicator } from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';

import chevron from '../../assets/chevron_blue.png';

const analytics = new Analytics('UA-65596113-1');

export default function ManageRelationshipsScreen() 
{
  let deviceWidth = Dimensions.get('window').width;

  const navigation = useNavigation();
  const [azSelected, setAZSelected] = useState(true);
  const [rankingSelected, setRankingSelected] = useState(false);
  const [groupsSelected, setGroupsSelected] = useState(false);
  const [filterRel, setFilterRel] = useState(true);

  const [data, setData] = useState({ "data": [] });
  const [isLoading, setIsLoading] = useState(true);

  var filterTitle = "Relationships";

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<MenuIcon />)
    });
  });

  useEffect(() => {

    //take this out if you don't want to simulate delay
    setTimeout(() => {
      fetchPressed("alpha");
    }, 2000);

  }, []);

  function azPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'A-Z', 0))
    setAZSelected(true);
    setRankingSelected(false);
    setGroupsSelected(false);
    fetchPressed("alpha");
  }

  function rankingPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Ranking', 0))
    setAZSelected(false);
    setRankingSelected(true);
    setGroupsSelected(false);
    fetchPressed("ranking");
  }

  function groupsPressed() {
    analytics.event(new Event('Manage Relationships', 'Tab Button', 'Groups', 0))
    setAZSelected(false);
    setRankingSelected(false);
    setGroupsSelected(true);
    fetchPressed("groups");
  }

  function filterPressed() {
    console.log('here');
    if (filterRel) {
      console.log(1);
      setFilterRel(false);
      return "Businesses"
    }
    console.log(2);
    setFilterRel(true);
    return "Relationships"

    //  analytics.event(new Event('Manage Relationships', 'Filter', filterTitle, 0))
  }

  function sanityCheck() {
    if (data == null) {
      return false;
    }

    if (data["data"] == null) {
      return false;
    }

    if (data["data"].length == 0) {
      return false;
    }
    return true;
  }

  function activityDisplay(index) {
    if (!sanityCheck())
      return "";

    if (winTheDaySelected) {
      return data["data"][index]["achievedToday"]
    }
    return data["data"][index]["achievedThisWeek"]
  }

  function filterTitle() 
  {
    if (filterRel) {
      console.log(10);
    //  setFilterRel(false);
      return "Businesses"
    }
    console.log(20);
  //  setFilterRel(true);
    return "Relationships"
  }

  function shouldDisplay(index) {
    if (!sanityCheck())
      return false;

    return data["data"][index]["goal"]["displayOnDashboard"];
  }

  function titleFor(index) {
    if (data == null) {
      return "";
    }
    if (data["data"] == null) {
      return "";
    }
    if (data["data"].length == 0) {
      return "";
    }
    var oldTitle = data["data"][index]["goal"]["title"];
    if (oldTitle == "Pop-By Made") {
      return "Pop-Bys Delivered"
    }
    if (oldTitle == "New Contacts") {
      return "Database Additions"
    }
    if (oldTitle == "Notes Made") {
      return "Notes Written"
    }
    return oldTitle;
  }

  function fetchPressed(type) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd");
    myHeaders.append("SessionToken", "56B6DEC45D864875820ECB094377E191");
    myHeaders.append("Cookie", "ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var azOrRankingURL = "https://www.referralmaker.com/services/mobileapi/contacts?sortType=" + type + "&lastItem=0&batchSize=1";
    var groupURL = "https://www.referralmaker.com/services/mobileapi/groups?lastItem=0&batchSize=10";
    var apiURL = azOrRankingURL;
    if (type == "groups") {
      apiURL = groupURL;
    }

    fetch(apiURL, requestOptions)
      .then(response => response.json()) //this line converts it to JSON
      .then((result) => {                  //then we can treat it as a JSON object
        console.log(result);
        setData(result);
        if (result.status == "error") {
          alert(result.error);
          setIsLoading(false)
        }
        else {
          setIsLoading(false)
          //  navigation.navigate('Home');
          //  alert(result.status);
        }
      })
      .catch(error => alert("failure " + error));
  }

  return (

    isLoading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>) :

      (
        <View style={styles.container}>
          <View style={styles.tabButtonRow}>
            <Text style={azSelected == true ? styles.selected : styles.unselected} onPress={azPressed}>A-Z</Text>
            <Text style={rankingSelected == true ? styles.selected : styles.unselected} onPress={rankingPressed}>Ranking</Text>
            <Text style={groupsSelected == true ? styles.selected : styles.unselected} onPress={groupsPressed}>Groups</Text>
          </View>
          <View style={styles.filterBox}>
            <TouchableOpacity onPress={filterPressed}>
              <Text style={styles.filterText}>{filterTitle}</Text>
              {/* <Image source={chevron} style={styles.chevron} /> */}
            </TouchableOpacity>
          </View>
        </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  hack: {
    height: 100,
    backgroundColor: 'white',
  },
  chevron: {
    flexDirection: 'row',
    flex: 1,
    height: 25,
    width: 25,
  },
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  filterText:
  {
    flexDirection: 'row',
    fontSize: 18,
    color: 'black'
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 16,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 10
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
    borderWidth: 2
  },
  goalTitle: {
    paddingRight: 30,
    color: '#1A6295',
    fontSize: 18,
    textAlign: 'right',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16
  },
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  goalName: {
    width: 200,
    color: '#1A6295',
    fontSize: 20,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 16
  },
  goalNum: {
    width: 20,
    height: 32,
    color: 'black',
    fontSize: 18,
    textAlign: "right",
    marginRight: 20,
  },
  grayRectangle: {
    height: 25,
    width: '75%',
    backgroundColor: 'lightgray',
    marginRight: 10,
    borderRadius: 5
  },
  trophy: {
    width: 35,
    height: 35,
    paddingBottom: 10,
  },
  trackText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
