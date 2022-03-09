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
  data: PACCompleteProps[];
  error: string;
  status: string;
}

// Save as Pop Favorite in Postman

export interface SaveAsFavoriteProps {
  contactId: string;
}

export interface SaveAsFavoriteResponse {
  data: SaveAsFavoriteProps[];
  error: string;
  status: string;
}
