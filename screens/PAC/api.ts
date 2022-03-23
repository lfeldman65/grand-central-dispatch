import { http } from '../../utils/http';
import {
  PACDataResponse,
  SaveAsFavoriteResponse,
  PACPostponeResponse,
  PACCompleteResponse,
  PACCDetailsResponse,
} from './interfaces'; // branch.

export function getPACData(type: string): Promise<PACDataResponse> {
  return http.get(`priorityActionsRN?type=${type}`);
} // back tick (`) only necessary for string interpolation

export function getPACDetails(guid: string): Promise<PACCDetailsResponse> {
  return http.get(`contacts/${guid}`);
}

export function saveAsFavorite(guid: string): Promise<SaveAsFavoriteResponse> {
  return http.get(`setasfavorite?contactGuid=${guid}`);
}

export function postponePAC(guid: string, type: string): Promise<PACPostponeResponse> {
  return http.post(`contactsPostponeAction/${guid}`, {
    body: { type },
  });
}

export function completePAC(contactGUID: string, type: string, notes: string): Promise<PACCompleteResponse> {
  return http.post(`contactsTrackAction/${contactGUID}`, {
    body: { type, notes },
  });
}
