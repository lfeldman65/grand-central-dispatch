import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import globalStyles from '../../globalStyles';
import { storage } from '../../utils/storage';

const messageImg = require('../Relationships/images/relMessage.png');
const callImg = require('../Relationships/images/relCall.png');
const videoImg = require('../Relationships/images/relVid.png');
const emailImg = require('../Relationships/images/relEmail.png');
const mapImg = require('../Relationships/images/relMap.png');
const activityImg = require('../Relationships/images/relActivity.png');
const toDoImg = require('../Relationships/images/relToDo.png');
const transImg = require('../Relationships/images/relTransaction.png');
const apptImg = require('../Relationships/images/relAppt.png');
const ideasImg = require('../Relationships/images/relIdeas.png');

export default function RelationshipDetailsScreen(props: any) {
  const { route } = props;
  const { contactId } = route.params;
  const navigation = useNavigation();
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
    console.log('larryA: ' + dOrlight);
  }

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  function HandleButtonPress() {
    console.log('button pressed');
  }

  return (
    <View style={lightOrDark == 'dark' ? globalStyles.containerDark : globalStyles.containerLight}>
      <View style={styles.row}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={messageImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Message</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={callImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Call</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={videoImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Video</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={emailImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Email</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={mapImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>Map</Text>}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={activityImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Activity
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={toDoImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              To-Do
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={transImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Transactn
            </Text>
          }
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={apptImg} style={styles.logo} />
          </TouchableOpacity>
          {<Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>Appt</Text>}
        </View>

        <View style={styles.pair}>
          <TouchableOpacity onPress={() => HandleButtonPress()}>
            <Image source={ideasImg} style={styles.logo} />
          </TouchableOpacity>
          {
            <Text style={lightOrDark == 'dark' ? styles.bottomButtonTextDark : styles.bottomButtonTextLight}>
              Ideas
            </Text>
          }
        </View>
      </View>

      <Text style={lightOrDark == 'dark' ? styles.topButtonTextDark : styles.topButtonTextLight}>{contactId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  pair: {
    flex: 1,
    marginTop: 5,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 5,
  },
  topButtonTextDark: {
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  topButtonTextLight: {
    height: 18,
    color: '#016497',
    textAlign: 'center',
  },
  bottomButtonTextDark: {
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  bottomButtonTextLight: {
    height: 18,
    width: 50,
    color: '#013273',
    textAlign: 'center',
  },
  namesDark: {
    height: 18,
    color: 'white',
    textAlign: 'center',
  },
  namesLight: {
    height: 18,
    color: 'black',
    textAlign: 'center',
  },
});
