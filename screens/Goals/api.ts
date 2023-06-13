import { http } from '../../utils/http';
import { TrackDataResponse, GoalDataResponse, GoalDataConciseResponse, RolodexDataResponse } from './interfaces';
import { isNullOrEmpty } from '../../utils/general';

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
  notes: string,
  referralInPast: boolean
): Promise<TrackDataResponse> {
  var body = {
    goalId: goalId,
    sourceGUID: guid,
    contactGUID: contactGUID,
    userGaveReferral: userGaveReferral,
    followUp: followUp,
    subject: isNullOrEmpty(subject) ? 'test' : subject,
    date: date,
    referral: referral,
    notes: notes,
    referralInPast: referralInPast,
  };
  console.log('body: ' + JSON.stringify(body));
  return http.post(`activityGoalsTrack/${guid}`, {
    body: {
      goalId: goalId,
      sourceGUID: guid,
      contactGUID: contactGUID,
      userGaveReferral: userGaveReferral,
      followUp: followUp,
      subject: isNullOrEmpty(subject) ? 'test' : subject,
      date: date,
      referral: referral,
      notes: notes,
      referralInPast: referralInPast,
    },
  });
}

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getRolodexSearch(searchParam: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?batchSize=50&lastItem=0&sortType=alpha&search=${searchParam}`);
} // bac
