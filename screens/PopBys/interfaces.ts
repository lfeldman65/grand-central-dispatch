// Pop-Bys List Radius in Postman

export interface PopByRadiusDataResponse {
  data: PopByRadiusDataProps[];
  error: string;
  status: string;
}

export interface PopByRadiusDataProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  homePhone: string;
  officePhone: string;
  ranking: string;
  distance: string;
  address: PopByAddress;
  location: PopByLocation;
  lastPopbyDate: string;
}

export interface PopByAddress {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isFavorite: string;
}

export interface PopByLocation {
  latitude: string;
  longitude: string;
}

// Save as Pop Favorite in Postman

export interface PopByFavoriteDataResponse {
  data: PopByFavoriteDataProps;
  error: string;
  status: string;
}

export interface PopByFavoriteDataProps {
  message: string;
}

// Remove as Pop Favorite in Postman

export interface PopByRemoveFavoriteDataResponse {
  data: PopByRemoveFavoriteDataProps;
  error: string;
  status: string;
}

export interface PopByRemoveFavoriteDataProps {
  message: string;
}

// Track Action in Postman

export interface PopCompleteProps {
  message: string;
}

export interface PopCompleteResponse {
  data: PopCompleteProps;
  error: string;
  status: string;
}
