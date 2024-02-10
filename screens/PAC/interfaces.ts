import Swipeable from 'react-native-gesture-handler/Swipeable';

// PAC List RN in Postman

export interface PACDataProps {
  contactId: string;
  contactName: string;
  homePhone: string;
  isFavorite: boolean;
  mobilePhone: string;
  officePhone: string;
  type: string;
  ranking: string;
  lastCallDate: string;
  lastNoteDate: string;
  lastPopByDate: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  longitude: string;
  latitude: string;
  swipeRef: Swipeable | null;
}

export interface PACDataResponse {
  data: PACDataProps[];
  error: string;
  status: string;
}

// PAC Postpone in Postman

export interface PACPostponeProps {
  message: string;
}

export interface PACPostponeResponse {
  data: PACPostponeProps[];
  error: string;
  status: string;
}

// Track Action in Postman

export interface PACCompleteProps {
  message: string;
}

export interface PACCompleteResponse {
  data: PACCompleteProps;
  error: string;
  status: string;
}

// Save as Pop Favorite in Postman

export interface SaveAsFavoriteProps {
  contactId: string;
}

export interface SaveAsFavoriteResponse {
  data: SaveAsFavoriteProps;
  error: string;
  status: string;
}

// Contact Details in Postman

export interface ContactDetailDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  mobile: string;
  homePhone: string;
  officePhone: string;
  address: AddressProps;
}

export interface AddressProps {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isFavorite: string;
}

export interface ContactDetailDataResponse {
  data: ContactDetailDataProps;
  error: string;
  status: string;
}
