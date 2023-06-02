import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { GroupsDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';

interface GroupsRowProps {
  data: GroupsDataProps;
  onPress(): void;
  lightOrDark: string;
}

export default function GroupsRow(props: GroupsRowProps) {
  const isFocused = useIsFocused();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.lightOrDark == 'dark' ? styles.groupRowDark : styles.groupRowLight}>
        <Text style={props.lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
          {props.data.groupName + ' (' + props.data.groupSizeLabel + ')'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
