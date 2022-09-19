import { AppointmentDataResponse, AppointmentDetailsDataResponse } from './interfaces';
import { AttendeesProps } from '../ToDo/interfaces';
import { http } from '../../utils/http';

export function getAppointments(month: string, year: string): Promise<AppointmentDataResponse> {
  return http.get(`calendarEvents?month=${month}&year=${year}`);
}

export function getAppointmentDetails(apptID: string): Promise<AppointmentDetailsDataResponse> {
  return http.get(`calendarEvents/${apptID}`);
}
