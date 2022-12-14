import { http } from '../../utils/http';
import {
  PopByRadiusDataResponse,
  PopByFavoriteDataResponse,
  PopByRemoveFavoriteDataResponse,
  PopCompleteResponse,
} from './interfaces';

export function getPopByRadiusData(param: string, lat: string, long: string): Promise<PopByRadiusDataResponse> {
  console.log('param: ' + param);
  console.log(`popbys?currentLocation=${lat}%2C${long}&lastItem=0&batchSize=50000&radius=30&sortType=${param}`);
  return http.get(`popbys?currentLocation=${lat}%2C${long}&lastItem=0&batchSize=50000&radius=30&sortType=${param}`);
}

export function getPopBysInWindow(
  type: string,
  latSE: string,
  lonSE: string,
  latNW: string,
  lonNW: string
): Promise<PopByRadiusDataResponse> {
  // console.log('type', type);
  // console.log('LATSE', latSE);
  // console.log('LONSE', lonSE);
  // console.log('LATNW', latNW);
  // console.log('LONNW', lonNW);

  return http.get(
    `PopBysInWindow?sortType=${type}&pointNWLat=${latNW}&pointNWLong=${lonNW}&pointSELat=${latSE}&pointSELong=${lonSE}`
  ); // NW lon = SW lon, NW lat = NE lat, SW lon = NW lon, SW lat = SE lat
}

export function savePop(guid: string): Promise<PopByFavoriteDataResponse> {
  return http.get(`setasfavorite?contactGuid=${guid}`);
}

export async function saveOrRemovePopBulk(contactGUIDs: string, task: string): Promise<PopCompleteResponse> {
  try {
    console.log('API POP GUIDS: ' + contactGUIDs);
    console.log('API POP TASK: ' + task);
    return http.post(`popByFavorites/${contactGUIDs}`, {
      body: { guids: contactGUIDs, task: task },
    });
  } catch (ex) {
    console.log('EXCEPTION: ' + ex);
    return Promise.reject();
  }
}

export function removePop(guid: string): Promise<PopByRemoveFavoriteDataResponse> {
  return http.get(`removeasfavorite?contactGuid=${guid}`);
}

export function completePop(contactGUID: string, type: string, note: string): Promise<PopCompleteResponse> {
  return http.post(`contactsTrackAction/${contactGUID}`, {
    body: { type, note },
  });
}
