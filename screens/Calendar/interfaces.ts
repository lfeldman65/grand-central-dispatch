// Appointments in Postman

export interface AppointmentDataResponse {
  data: AppointmentDataProps[];
  error: string;
  status: string;
}

export interface AppointmentDataProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
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

// Appointment Details in Postman

export interface AppointmentDetailsDataResponse {
  data: AppointmentsDetailsDataProps;
  error: string;
  status: string;
}

export interface AppointmentsDetailsDataProps {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  startTime: string;
  endTime: string;
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
