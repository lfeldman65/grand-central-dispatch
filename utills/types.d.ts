import { RootStackParamList } from './components/Navigation'

declare module '*.png';
declare module '*.jpg';
declare module '*.gif';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}