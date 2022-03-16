import { http } from '../../utils/http';
import { PACDataResponse, SaveAsFavoriteProps, PACPostponeResponse, PACCompleteResponse } from './interfaces';

export function getPACData(type: string): Promise<PACDataResponse> {
  return http.get(`priorityActionsRN?type=${type}`);
}

export function saveAsFavorite(guid: string): Promise<SaveAsFavoriteProps> {
  return http.get(`setasfavorite?contactGuid=${guid}`);
}

export function postponePAC(guid: string, type: string): Promise<PACPostponeResponse> {
  return http.post(`contactsPostponeAction/${guid}`, {
    body: { type }
  });
}

export function completePAC(contactGUID: string): Promise<PACCompleteResponse> {
  return http.post(`contactsTrackAction/${contactGUID}`);
}
