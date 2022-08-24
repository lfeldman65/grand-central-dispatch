// Profile in Postman

export interface ProfileDataResponse {
  data: ProfileDataProps;
  error: string;
  status: string;
}

export interface ProfileDataProps {
  email: string;
  businessType: string;
  timezone: string;
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

// Edit Profile in Postman

export interface EditProfileDataResponse {
  data: EditProfileProps;
  error: string;
  status: string;
}

export interface EditProfileProps {
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
