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
  TouchableHighlight,
} from 'react-native';
import MenuIcon from '../../components/menuIcon';
import { useState, useEffect } from 'react';
import { Event } from 'expo-analytics';
import Swipeable from 'react-native-swipeable-row';
import styles from './styles';
import { analytics } from '../../constants/analytics';
import * as SMS from 'expo-sms';
import { add, set } from 'react-native-reanimated';
import { saveAsFavorite } from './api';
import { SaveAsFavoriteProps } from './interfaces';
import openMap from 'react-native-open-maps';
import { useNavigation } from '@react-navigation/native';

export default function PACPopRow(props) {
  const [saveShown, setSaveShown] = useState(!props.data.isFavorite);

  // const [data, setData] = useState<SaveAsFavoriteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({ data: [] });

  const navigation = useNavigation();

  function handlePhonePressed(number) {
    console.log(number);
    Linking.openURL(`tel:${number}`);
  }

  useEffect(() => {
    titleForSaveButton();
  }, [saveShown]);

  useEffect(() => {
    styleForSaveButton;
  }, [saveShown]);

  function handleText(number) {
    console.log(number);
    if (SMS.isAvailableAsync()) {
      const { result } = SMS.sendSMSAsync(['8478774043'], 'My sample HelloWorld message');
    } else {
    }
  }

  function titleForSaveButton() {
    if (saveShown) {
      return 'Save to Map';
    }
    return 'Saved';
  }

  function handleDirectionsPressed() {
    //   openMap({ latitude: 33.1175, longitude: -117.0722, zoom: 10 });
    //   openMap({ query: '7743 Royal Park Dr. Lewis Center OH 43035' });
    openMap({ query: completeAddress() });
  }

  function completeAddress() {
    var addressString = '';
    if (props.data.street1 != null) {
      addressString = addressString + ' ' + props.data.street1;
    }
    if (props.data.street2 != null) {
      addressString = addressString + ' ' + props.data.street2;
    }
    if (props.data.city != null) {
      addressString = addressString + ' ' + props.data.city;
    }
    if (props.data.state != null) {
      addressString = addressString + ' ' + props.data.state;
    }
    if (props.data.zip != null) {
      addressString = addressString + ' ' + props.data.street2;
    }
    return addressString;
  }

  function handleSavePressed() {
    if (saveShown) {
      saveAsFavoriteAPI();
      setSaveShown(!saveShown);
    } else {
      console.log('hey dude');
    }
  }

  function styleForSaveButton() {
    if (saveShown) {
      return {
        color: '#02ABF7',
        fontSize: 15,
        textAlign: 'right',
        marginRight: 10,
        marginTop: -2,
      };
    }
    return {
      color: 'gray',
      fontSize: 15,
      textAlign: 'right',
      marginRight: 10,
      marginTop: -2,
    };
  }

  function handlePopPressed() {
    console.log('pop');
    navigation.navigate('Pop-Bys');
  }

  function saveAsFavoriteAPI() {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'YWNzOmh0dHBzOi8vcmVmZXJyYWxtYWtlci1jYWNoZS5hY2Nlc3Njb250cm9sLndpbmRvd');
    myHeaders.append('SessionToken', '56B6DEC45D864875820ECB094377E191');
    myHeaders.append('Cookie', 'ASP.NET_SessionId=m4eeiuwkwetxz2uzcjqj2x1a');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    var testGuid = 'e501958d-ee78-4ebb-8549-5bbf8ed6a5f2';
    var apiURL = 'https://www.referralmaker.com/services/mobileapi/setasfavorite?contactGuid=' + props.data.contactId;
    ('1158a33e-2451-4de4-94e1-8336b419ef05');
    console.log('contact api: ' + apiURL);
    fetch(apiURL, requestOptions)
      .then((response) => response.json()) //this line converts it to JSON
      .then((result) => {
        //then we can treat it as a JSON object
        // console.log(result);
        setData(result);
        if (result.status == 'error') {
          alert(result.error);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => alert('failure ' + error));
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.row}>
        <View style={styles.popbyRow}>
          <Text style={styles.personName}>{props.data.contactName}</Text>
          {props.data.street1 != null && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handleDirectionsPressed()}>
              <Text style={styles.popByButtons}>{'Directions'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.popbyRow}>
          <Text style={styles.otherText}>{'Ranking: ' + props.data.ranking}</Text>
          {props.data.street1 && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handleSavePressed()}>
              <Text style={styleForSaveButton()}>{titleForSaveButton()}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.popbyRow}>
          <Text style={styles.otherText}>{'Last Pop-By: ' + props.data.lastPopByDate}</Text>
          {props.data.street1 && (
            <TouchableOpacity style={styles.popByButtons} onPress={() => handlePopPressed()}>
              <Text style={styles.popByButtons}>{'Pop-By Map'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {props.data.street1 != null && <Text style={styles.streetText}>{props.data.street1}</Text>}
        {props.data.street2 != null && <Text style={styles.streetText}>{props.data.street2}</Text>}
        {props.data.city != null && (
          <Text style={styles.cityStateZipText}>{props.data.city + ' ' + props.data.state + ' ' + props.data.zip}</Text>
        )}
        {props.data.mobilePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.mobilePhone)}>
            <Text style={styles.phoneNumber}>{'Mobile: ' + props.data.mobilePhone}</Text>
          </TouchableOpacity>
        )}

        {props.data.officePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.officePhone)}>
            <Text style={styles.phoneNumber}>{'Office: ' + props.data.officePhone}</Text>
          </TouchableOpacity>
        )}

        {props.data.homePhone != null && (
          <TouchableOpacity style={styles.phoneRow} onPress={() => handlePhonePressed(props.data.homePhone)}>
            <Text style={styles.phoneNumber}>{'Home: ' + props.data.homePhone}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
