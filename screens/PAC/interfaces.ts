// PAC List RN in Postman
// export interface APIResponseProps {
//   data: any;
//   error: string;
//   status: string;
// }

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
}

export interface PACDataResponse {
  data: PACDataProps[];
  error: string;
  status: string;
}

// PAC Postpone in Postman

export interface PACPostponeProps {
  contactId: string;
}

export interface PACPostponeResponse {
  data: PACPostponeProps[];
  error: string;
  status: string;
}

// Track Action in Postman

export interface PACCompleteProps {
  contactId: string;
}

export interface PACCompleteResponse {
  data: PACCompleteProps[];
  error: string;
  status: string;
}

// Contact Details in Postman

export interface PACDetailsProps {
  contactId: string;
}

export interface PACCDetailsResponse {
  data: PACDetailsProps[];
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

export interface ContactDetailProps {
  // ranking: string;
  // qualified: string;
  // mobile: string;
  // homePhone: string;
  // officePhone: string;
  // email: string;
  // spouse: any,
  // website: string,
  address: AddressProps;
}

interface AddressProps {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isFavorite: string;
}
