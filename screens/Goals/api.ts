import { http } from '../../utils/http';
import { GoalDataResponse } from './interfaces';

// Goal Wins in Postman

export function getGoalData(): Promise<GoalDataResponse> {
  return http.get('activityGoalsWins');
}
