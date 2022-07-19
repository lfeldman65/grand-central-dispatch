import { http } from '../../utils/http';
import { LoginDataResponse, ProfileDataResponse } from './interfaces';

export function loginToApp(email: string, password: string): Promise<LoginDataResponse> {
  return http.post('login', {
    body: { email, password },
  });
}

export function getProfileData(): Promise<ProfileDataResponse> {
  return http.get('setup/profile');
}
