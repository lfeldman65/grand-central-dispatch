import { http } from '../../utils/http';
import { TrackDataResponse, GoalDataResponse, RolodexDataResponse } from './interfaces';

export function getGoalData(): Promise<GoalDataResponse> {
  return http.get('activityGoalsWins');
}

export function trackAction(guid: string, thisGoal: string, thisNote: string): Promise<TrackDataResponse> {
  console.log('API type: ' + thisGoal);
  return http.post(`contactsTrackAction/${guid}`, {
    body: { type: thisGoal, note: thisNote },
  });
}

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getRolodexSearch(searchParam: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?batchSize=50&lastItem=0&sortType=alpha&search=${searchParam}`);
}
