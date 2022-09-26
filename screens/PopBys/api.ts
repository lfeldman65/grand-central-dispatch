import { http } from '../../utils/http';
import {
  PopByRadiusDataResponse,
  PopByFavoriteDataResponse,
  PopByRemoveFavoriteDataResponse,
  PopCompleteResponse,
} from './interfaces';

export function getPopByRadiusData(tab: string): Promise<PopByRadiusDataResponse> {
  var param = '';
  if (tab == 'Near Me') {
    param = 'nearby';
  } else if (tab == 'Priority') {
    param = 'priority';
  } else if (tab == 'Saved') {
    param = 'favorites';
    console.log('param: ' + param);
  }
  console.log('param: ' + param);
  console.log(`popbys?currentLocation=33.1175%2C-117.25&lastItem=0&batchSize=50000&radius=30&sortType=${param}`);
  return http.get(`popbys?currentLocation=33.1175%2C-117.25&lastItem=0&batchSize=50000&radius=30&sortType=${param}`);
}

export function savePop(guid: string): Promise<PopByFavoriteDataResponse> {
  return http.get(`setasfavorite?contactGuid=${guid}`);
}

export function removePop(guid: string): Promise<PopByRemoveFavoriteDataResponse> {
  return http.get(`removeasfavorite?contactGuid=${guid}`);
}

export function completePop(contactGUID: string, type: string, note: string): Promise<PopCompleteResponse> {
  return http.post(`contactsTrackAction/${contactGUID}`, {
    body: { type, note },
  });
}
