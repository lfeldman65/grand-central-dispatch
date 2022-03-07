// PAC Top Level (PAC list in Postman)

export interface PACDataProps {
  contactId: string;
  contactName: string;
  homePhone: string;
  isFavorite: boolean;
  mobile: string;
  notes: string;
  officePhone: string;
  type: string;
}

export interface PACDataResponse {
  data: PACDataProps[];
  error: string;
  status: string;
}

// PAC Postpone

export interface PACPostponeProps {
  contactId: string;
}

export interface PACPostponeResponse {
  data: PACPostponeProps[];
  error: string;
  status: string;
}

// PAC Complete

export interface PACCompleteProps {
  contactId: string;
}

export interface PACCompleteResponse {
  data: PACCompleteProps[];
  error: string;
  status: string;
}
