import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { RolodexImportDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface ImportRowProps {
  data: RolodexImportDataProps;
  onPress(): void;
  relFromAbove: string;
  lightOrDark: string;
}

export default function ImportRelRow(props: ImportRowProps) {
  const { relFromAbove, lightOrDark } = props;
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
        <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {props.data.firstName + ' ' + props.data.lastName}
        </Text>
        <View style={styles.checkView}>
          <BouncyCheckbox // https://github.com/WrathChaos/react-native-bouncy-checkbox
            size={25}
            textStyle={{ color: 'white', textDecorationLine: 'none', fontSize: 18 }}
            fillColor="#37C0FF"
            unfillColor="white"
            iconStyle={{ borderColor: 'gray' }}
            text=""
            disableBuiltInState={true}
            isChecked={props.data.selected}
            textContainerStyle={{ marginLeft: 10 }}
            onPress={(isChecked: boolean) => {
              //console.log(isChecked);
              props.onPress();
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  checkView: {
    marginTop: 12,
    left: '90%',
    position: 'absolute',
    marginBottom: 12,
  },
  personNameDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  personNameLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
  },
  rankingCircle: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
  },
});
