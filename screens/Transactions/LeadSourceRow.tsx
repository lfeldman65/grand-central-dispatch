import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';

interface LeadSourceProps {
  data: string;
  onPress(): void;
}

export default function LeadSourceRow(props: LeadSourceProps) {
  const [lightOrDark, setLightOrDark] = useState('');

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <TouchableOpacity onPress={props.onPress}>
        <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={lightOrDark == 'dark' ? styles.sourceDark : styles.sourceLight}>{props.data}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

export const styles = StyleSheet.create({
  sourceDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  sourceLight: {
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
});
