export interface GoalObject {
  id: string;
  title: string;
  custom: boolean;
  weeklyTarget: number;
  displayOnDashboard: boolean;
}

export interface GoalDataProps {
  goal: GoalObject;
  achievedToday: number;
  achievedThisWeek: number;
}

export interface GoalDataResponse {
  data: GoalDataProps[];
  error: string;
  status: string;
}
