import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import React from 'react';
import { getProfileData } from '../Settings/api';
import { ProfileDataProps } from '../Settings/interfaces';
import { RolodexDataProps } from '../Relationships/interfaces';

export default function AddTransactionMenu(props: any) {
  const { route } = props;
  const { lightOrDark } = route.params;
  const [person, setPerson] = useState<RolodexDataProps>(); // if called from relationship detail, shouldn't be null
  const [profileData, setProfileData] = useState<ProfileDataProps>();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  function buttonPressed(index: number) {
    console.log('index: ' + index);
    if (index == 0) {
      console.log('PERSONADD: ' + person?.firstName);
      console.log('theme: ' + lightOrDark);
      navigation.navigate('AddOrEditRealtorTx1', {
        person: person,
        lightOrDark: lightOrDark,
      });
    } else if (index == 1) {
      console.log('PERSONADD: ' + person?.firstName);
      navigation.navigate('AddOrEditLenderTx1', {
        person: person,
        lightOrDark: lightOrDark,
      });
    } else if (index == 2) {
      navigation.navigate('AddOrEditOtherTx1', {
        person: person,
        lightOrDark: lightOrDark,
      });
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: 'Add Transaction',
    });
  }, [navigation]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    if (route.params != null) {
      setPerson(route.params.person);
      console.log('PERSON: ' + person?.firstName);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function fetchProfile(isMounted: boolean) {
    getProfileData()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setProfileData(res.data);
          console.log('type: ' + res.data.businessType);
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.buttonText}>{profileData?.businessType}</Text> */}

      {profileData?.businessType.includes('realtor') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(0)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Realtor Transactions'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {profileData?.businessType.toLowerCase().includes('lender') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(1)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Lender Transactions'}</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(2)}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Other Transactions'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
    borderWidth: 0.5,
    borderTopColor: 'white',
  },
  buttonContainer: {
    backgroundColor: '#1A6295',
    height: 60,
    marginTop: 10,
    marginBottom: 2,
  },
  buttonView: {
    backgroundColor: '#1A6295',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 6,
    height: 50,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
  },
});
