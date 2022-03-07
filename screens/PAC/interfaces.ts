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

export interface PACPostponeProps {}

export interface PACPostponeResponse {
  data: PACDataProps[];
  error: string;
  status: string;
}

// PAC Complete
