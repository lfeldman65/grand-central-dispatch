import { User } from 'react-native-feather';
import { sub } from 'react-native-reanimated';
import { http } from '../../utils/http';
import { TrackDataResponse, GoalDataResponse, GoalDataConciseResponse, RolodexDataResponse } from './interfaces';

export function getGoalData(): Promise<GoalDataResponse> {
  return http.get('activityGoalsWins');
}

export function getGoalDataConcise(): Promise<GoalDataConciseResponse> {
  return http.get('activityGoals');
}

export function trackAction(
  guid: string,
  goalId: string,
  contactGUID: string,
  userGaveReferral: boolean,
  followUp: boolean,
  subject: string,
  date: string,
  referral: boolean,
  notes: string
): Promise<TrackDataResponse> {
  console.log('API guid: ' + guid);
  console.log('API goalID: ' + goalId);
  console.log('API subject: ' + subject);
  console.log('API date: ' + date);
  console.log('API referral: ' + referral);
  console.log('API notes: ' + notes);
  console.log('API contact GUID: ' + contactGUID);
  console.log('API USER GAVE REF ' + userGaveReferral);

  return http.post(`activityGoalsTrack/${guid}`, {
    body: {
      goalId: goalId,
      sourceGUID: guid,
      contactGUID: contactGUID,
      userGaveReferral: userGaveReferral,
      followUp: followUp,
      subject: subject,
      date: date,
      referral: referral,
      notes: notes,
    },
  });
}

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getRolodexSearch(searchParam: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?batchSize=50&lastItem=0&sortType=alpha&search=${searchParam}`);
} // bac
