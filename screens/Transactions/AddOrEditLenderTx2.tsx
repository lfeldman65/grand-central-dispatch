import { Fragment, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { analytics } from '../../utils/analytics';
import React from 'react';
import globalStyles from '../../globalStyles';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AddTxBuyerAndSellerSheets,
  probabilityMenu,
  loanTypeMenu,
  loanTypeDescriptionMenu,
  styles,
} from './transactionHelpers';

var grossComm1 = 0;

export default function AddOrEditLenderTx2(props: any) {
  return (
    <View style={styles.container}>
      <ScrollView></ScrollView>
    </View>
  );
}
