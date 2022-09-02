import { sub } from 'react-native-reanimated';
import { http } from '../../utils/http';
import { TrackDataResponse, GoalDataResponse, RolodexDataResponse } from './interfaces';

export function getGoalData(): Promise<GoalDataResponse> {
  return http.get('activityGoalsWins');
}

export function trackAction(
  guid: string,
  goalId: string,
  subject: string,
  date: string,
  referral: boolean,
  notes: string
): Promise<TrackDataResponse> {
  console.log('guid: ' + guid);
  return http.post(`activityGoalsTrack/${guid}`, {
    body: { goalId: goalId, subject: subject, date: date, referral: referral, notes: notes },
  });
}

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getRolodexSearch(searchParam: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?batchSize=50&lastItem=0&sortType=alpha&search=${searchParam}`);
} // bac
