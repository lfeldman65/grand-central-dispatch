// ToDo in Postman

export interface ToDoDataResponse {
  data: ToDoDataProps[];
  error: string;
  status: string;
}

export interface ToDoDataProps {
  id: string;
  title: string;
  notes: string;
  dueDate: string;
  priority: boolean;
  completedDate: string;
  isCampaign: boolean;
}

// ToDo Details in Postman

export interface ToDoDetailsDataResponse {
  data: ToDoDetailsDataProps;
  error: string;
  status: string;
}

export interface ToDoDetailsDataProps {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  completedDate: string;
  location: string;
  notes: string;
  canEdit: boolean;
  canPostpone: boolean;
  isCampaign: boolean;
  recurrence: RecurrenceProps;
  reminder: ReminderProps;
  attendees: AttendeesProps[];
}

export interface RecurrenceProps {
  untilType: string;
  untilDate: string;
  untilTimes: number;
  frequencyType: string;
  weeklyMonday: boolean;
  weeklyTuesday: boolean;
  weeklyWednesday: boolean;
  weeklyThursday: boolean;
  weeklyFriday: boolean;
  weeklySaturday: boolean;
  weeklySunday: boolean;
  weeklyEveryNWeeks: number;
  monthlyEveryNMonths: number;
  monthlyWeekNumber: number;
  yearlyWeekNumber: number;
  yearlyEveryNYears: number;
}

export interface ReminderProps {
  daysBefore: number;
  type: string;
}

export interface AttendeesProps {
  name: string;
  id: string;
}

// To-Do Mark Complete in Postman

export interface ToDoMarkCompleteDataResponse {
  data: ToDoMarkCompleteProps;
  error: string;
  status: string;
}

export interface ToDoMarkCompleteProps {
  id: ToDoDetailsDataProps;
  title: string;
  completedDate: string;
}

// Delete To-Do in Postman

export interface ToDoDeleteDataResponse {
  data: ToDoDeleteProps;
  error: string;
  status: string;
}

export interface ToDoDeleteProps {
  message: string;
}

// Add New To Do in Postman

export interface AddToDoDataProps {
  title: string;
  dueDate: string;
  priority: boolean;
  location: string;
  notes: string;
  recurrence: RecurrenceProps;
}

export interface AddToDoDataResponse {
  data: AddToDoDataProps[];
  error: string;
  status: string;
}
