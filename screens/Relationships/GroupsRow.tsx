import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { GroupsDataProps } from './interfaces';
const chevron = require('../../images/chevron_blue_right.png');

interface GroupsRowProps {
  data: GroupsDataProps;
  onPress(): void;
}

export default function GroupsRow(props: GroupsRowProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.groupRow}>
        <Text style={styles.personName}>{props.data.groupName + ' (' + props.data.groupSizeLabel + ')'}</Text>
        <Image source={chevron} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}
