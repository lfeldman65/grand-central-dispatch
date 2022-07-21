import { http } from '../../utils/http';
import { ProfileDataResponse } from './interfaces';

export function getProfileData(): Promise<ProfileDataResponse> {
  return http.get('setup/profile');
}
