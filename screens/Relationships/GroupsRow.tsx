import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { GroupsDataProps } from './interfaces';
import { storage } from '../../utils/storage';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

const chevron = require('../../images/chevron_blue_right.png');

interface GroupsRowProps {
  data: GroupsDataProps;
  onPress(): void;
}

export default function GroupsRow(props: GroupsRowProps) {
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={lightOrDark == 'dark' ? styles.groupRowDark : styles.groupRowLight}>
        <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {props.data.groupName + ' (' + props.data.groupSizeLabel + ')'}
        </Text>
        <Image source={chevron} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}
