import { http } from '../../utils/http';
import { ProfileDataResponse, EditProfileDataResponse } from './interfaces';

export function getProfileData(): Promise<ProfileDataResponse> {
  return http.get('setup/profile');
}

export function editProfileData(
  email: string,
  businessType: string,
  timezone: string,
  mobile: string,
  firstName: string,
  lastName: string,
  companyName: string,
  street1: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string
): Promise<EditProfileDataResponse> {
  return http.post('setup/profile', {
    body: {
      email,
      businessType,
      timezone,
      mobile,
      firstName,
      lastName,
      companyName,
      street1,
      street2,
      city,
      state,
      zip,
      country,
    },
  });
}
