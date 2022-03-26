import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
const closeButton = require('../../images/button_close_white.png');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { analytics } from '../../utils/analytics';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';

let deviceWidth = Dimensions.get('window').width;

export default function AddRelationshipScreen(props) {
  const { onSave, setModalVisible, contactName } = props;
  const [bizChecked, setbBizCheck] = useState(false);
  const isFocused = useIsFocused();

  function SavePressed() {
    // setModalVisible(false);
    // onSave(note);
  }
  function CancelPressed() {
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{contactName}</Text>

        <TouchableOpacity onPress={SavePressed}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
        size={25}
        textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
        fillColor="#37C0FF"
        unfillColor="#004F89"
        iconStyle={{ borderColor: 'white' }}
        text="This is a Business"
        textContainerStyle={{ marginLeft: 10 }}
        onPress={(isChecked: boolean) => {
          console.log(isChecked);
          setbBizCheck(!bizChecked);
        }}
      />

      <View style={styles.mainContent}>
        {bizChecked && (
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              placeholder="+ Add"
              placeholderTextColor="#AFB9C2"
              textAlign="left"
              //   onChangeText={(text) => setUserName(text)}
              //   defaultValue={userName}
            />
          </View>
        )}

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            textAlign="left"
            //   onChangeText={(text) => setUserName(text)}
            //   defaultValue={userName}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="+ Add"
            placeholderTextColor="#AFB9C2"
            //   onChangeText={(text) => setPassword(text)}
            //  defaultValue={password}
          />
        </View>
        <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
          size={25}
          textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
          fillColor="#37C0FF"
          unfillColor="#004F89"
          iconStyle={{ borderColor: 'white' }}
          text="This relationship is a referral"
          textContainerStyle={{ marginLeft: 10 }}
          onPress={(isChecked: boolean) => {
            console.log(isChecked);
            setbBizCheck(!bizChecked);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeX: {
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  inputView: {
    backgroundColor: '#002341',
    width: 0.9 * deviceWidth,
    height: 50,
    marginBottom: 2,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
});
