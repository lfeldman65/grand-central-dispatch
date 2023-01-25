import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');
const qual = require('../Relationships/images/qualChecked.png');

export default function SortScreen1(props: any) {
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Sorting Relationships',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={nextPressed}>
          <Text style={styles.saveText}>Next</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function backPressed() {
    navigation.navigate('SettingsScreen');
  }

  function nextPressed() {
    console.log();
    navigation.navigate('Sort2');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.fieldText}>
          Last Step. Referral Maker will help you sort your relationships by allowing you to rank each one of your
          contacts. Rate your contacts based on how likely they are to refer yuo as an agent.
        </Text>
      </View>
      <View style={styles.dividingLine}></View>
      <View style={styles.rankBox}>
        <View style={styles.rankRow}>
          <Image source={rankAPlus} style={styles.logoImage} />
          <Text style={styles.fieldText2}>People who have sent you multiple referrals.</Text>
        </View>
        <View style={styles.dividingLine}></View>
        <View style={styles.rankRow}>
          <Image source={rankA} style={styles.logoImage} />
          <Text style={styles.fieldText2}>
            People who have sent you a referral in the past or are most likely to refer you.
          </Text>
        </View>
        <View style={styles.dividingLine}></View>
        <View style={styles.rankRow}>
          <Image source={rankB} style={styles.logoImage} />
          <Text style={styles.fieldText2}>People who would refer you, if asked and shown how.</Text>
        </View>
        <View style={styles.dividingLine}></View>
        <View style={styles.rankRow}>
          <Image source={rankC} style={styles.logoImage} />
          <Text style={styles.fieldText2}>People who might refer you in the future.</Text>
        </View>
        <View style={styles.dividingLine}></View>
        <View style={styles.rankRow}>
          <Image source={rankD} style={styles.logoImage} />
          <Text style={styles.fieldText2}>People who you do not wish to market your services to.</Text>
        </View>
        <View style={styles.dividingLine}></View>
        <Text style={styles.fieldText3}>Qualified</Text>

        <View style={styles.rankRow}>
          <Image source={qual} style={styles.logoImage} />
          <Text style={styles.fieldText2}>I asked if I was the Realtor they would use or refer and they said yes!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  topView: {
    height: '15%',
    flexDirection: 'column',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  rankBox: {
    height: '50%',
    flexDirection: 'column',
  },
  rankRow: {
    flexDirection: 'row',
    height: '15%',
  },
  dividingLine: {
    backgroundColor: 'lightgray',
    height: 1,
  },
  logoImage: {
    height: 30,
    width: 30,
    marginLeft: 15,
    marginTop: '3%',
    marginBottom: 10,
  },
  fieldText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  fieldText2: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    width: '80%',
  },
  fieldText3: {
    marginTop: 10,
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    marginBottom: 5,
  },
});
