import { http } from '../../utils/http';
import { PACDataResponse } from './interfaces';

export function getPACData(type: string): Promise<PACDataResponse> {
  return http.get(`priorityActionsRN?type=${type}`);
}
