import { ImageSourcePropType } from 'react-native';
import { RootStackParamList } from './components/Navigation'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}