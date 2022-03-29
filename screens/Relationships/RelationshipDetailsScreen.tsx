import { Text, View } from 'react-native';
import MenuIcon from '../../components/MenuIcon';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function RelationshipDetailsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon />,
    });
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Relationship Details</Text>
    </View>
  );
}