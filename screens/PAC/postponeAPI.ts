import { http } from '../../utils/http';
import { PACPostponeResponse } from './interfaces';

export function postPACPostpone(contactGUID: string): Promise<PACPostponeResponse> {
  return http.post(`priorityActions?type=${contactGUID}`);
}
