import { http } from '../../utils/http';
import { LoginDataResponse } from './interfaces';

export function loginToApp(email: string, password: string): Promise<LoginDataResponse> {
  return http.post('login', {
    body: { email, password },
  });
}
