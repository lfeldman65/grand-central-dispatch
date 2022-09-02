// Goal Wins in Postman

export interface GoalObject {
  id: number;
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

// Track Action in Postman

export interface TrackDataProps {
  goalId: string;
}

export interface TrackDataResponse {
  data: TrackDataProps;
  error: string;
  status: string;
}

// AZ Contacts in Postman

export interface RolodexDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  contactTypeID: string;
  employerName: string;
  qualified: boolean;
  selected: boolean;
}

export interface RolodexDataResponse {
  data: RolodexDataProps[];
  error: string;
  status: string;
}

// For Track Activity

export interface RelProps {
  name: string;
  id: string;
}
