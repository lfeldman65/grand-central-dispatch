import { http } from '../../utils/http';
import { LoginDataResponse } from './interfaces';

export function loginToApp(name: string, pw: string): Promise<LoginDataResponse> {
  return http.post('login', {
    body: { name, pw },
  });
}
