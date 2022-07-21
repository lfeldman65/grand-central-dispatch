// Profile in Postman

export interface ProfileDataResponse {
  data: ProfileProps;
  error: string;
  status: string;
}

export interface ProfileProps {
  email: string;
  businesstype: string;
  timezonne: string;
  mobile: string;
  firstName: string;
  lastName: string;
  companyName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  hasBombBombPermission: boolean;
}
