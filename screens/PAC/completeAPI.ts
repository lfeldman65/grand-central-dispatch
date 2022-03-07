import { http } from '../../utils/http';
import { PACPostponeResponse } from './interfaces';

export function postPACComplete(contactGUID: string): Promise<PACPostponeResponse> {
  return http.post(`contactsPostponeAction/' + 'contactGUID`);
}
