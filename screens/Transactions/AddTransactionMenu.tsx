import { Fragment, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import { getProfileData } from '../Settings/api';
import { ProfileDataProps } from '../Settings/interfaces';

export default function AddTransactionMenu(props: any) {
  const [profileData, setProfileData] = useState<ProfileDataProps>();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  function buttonPressed(index: number) {
    console.log('index: ' + index);
    if (index == 0) {
      navigation.navigate('AddTxBuyer1');
    } else if (index == 1) {
      console.log('Seller');
    } else if (index == 2) {
      console.log('Buyer and Seller');
    } else if (index == 3) {
      console.log('Purchase Loan and Refinance');
    } else if (index == 4) {
      console.log('Lease and Referral Fee');
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
            <Text style={styles.buttonText}>{'Buyer'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {profileData?.businessType.includes('realtor') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(1)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Seller'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {profileData?.businessType.includes('realtor') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(2)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Buyer & Seller'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {profileData?.businessType.toLowerCase().includes('lender') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(3)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Purchase Loan/Refinance'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {profileData?.businessType.toLowerCase().includes('realtor') && (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => buttonPressed(4)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Lease/Referral Fee'}</Text>
          </View>
        </TouchableOpacity>
      )}
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
