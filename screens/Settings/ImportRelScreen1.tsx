import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';

const rmLogo = require('./images/upload_contacts.png');

export default function ImportRelScreen1(props: any) {
  const { lightOrDark } = props;
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    console.log('LIGHTORDARK!!!: ' + props.lightOrDark);
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Import Relationships',
      headerLeft: () => (
        <TouchableOpacity style={styles.saveButton} onPress={backPressed}>
          <Text style={styles.saveText}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={nextPressed}>
          <Text style={styles.saveText}>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function backPressed() {
    navigation.navigate('SettingsScreen');
  }

  function nextPressed() {
    console.log('Import Next: ' + lightOrDark);
    navigation.navigate('ImportRel2', {
      lightOrDark: lightOrDark,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.fieldText}>
          Referral Maker accesses your existing contacts to help you sort your relationships and reach your goals. Don't
          worry, you don't have to import everyone into the app, and your contacts will not be notified. Also,
          duplicates will not be shown. In the next step, you can select who'd you'd like to import.
        </Text>
        <View style={styles.imageBox}>
          <Image source={rmLogo} style={styles.logoImage} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  saveButton: {
    padding: 10,
    // backgroundColor: '#00AAAA'
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  mainContent: {
    alignItems: 'center',
  },
  topView: {
    height: 190,
    flexDirection: 'column',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  imageBox: {
    width: 232,
    height: 167,
    marginTop: 20,
    marginRight: 30,
    alignSelf: 'center',
  },
  logoImage: {
    width: 232,
    height: 167,
    marginLeft: 15,
    marginRight: 5,
    alignItems: 'center',
  },
  fieldText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  filterView: {
    width: '100%',
    padding: 12,
  },
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
});
