import { AppointmentDataResponse, AppointmentDetailsDataResponse, AddAppointmentDataResponse } from './interfaces';
import { AttendeesProps } from '../ToDo/interfaces';
import { http } from '../../utils/http';

export function getAppointments(day: string, month: string, year: string): Promise<AppointmentDataResponse> {
  return http.get(`calendarEventsDay?day=${day}&month=${month}&year=${year}`);
}

export function addNewAppointmentTest(
  title: string,
  startTime: string,
  endTime: string,
  location: string,
  notes: string,
  untilType: string,
  frequencyType: string,
  timeBefore: number,
  type: string
): Promise<AddAppointmentDataResponse> {
  return http.post('calendarEvents', {
    body: {
      // no bracket since not an array
      title: title,
      startTime: startTime,
      endTime: endTime,
      untilType: untilType,
      location: location,
      notes: notes,
      recurrence: {
        frequencyType: frequencyType,
      },
      reminder: {
        timeBefore: timeBefore,
        type: type,
      },
    },
  });
}

export function addNewAppointment(
  title: string,
  startTime: string,
  endTime: string,
  location: string,
  notes: string,
  untilType: string,
  untilDate: string,
  untilTimes: string,
  frequencyType: string,
  weeklyMonday: boolean,
  weeklyTuesday: boolean,
  weeklyWednesday: boolean,
  weeklyThursday: boolean,
  weeklyFriday: boolean,
  weeklySaturday: boolean,
  weeklySunday: boolean,
  weeklyEveryNWeeks: number,
  monthlyEveryNMonths: number,
  monthlyWeekNumber: number,
  yearlyWeekNumber: number,
  yearlyEveryNYears: number,
  timeBefore: number,
  beforeUnit: string,
  type: string,
  attendees: AttendeesProps[]
): Promise<AddAppointmentDataResponse> {
  // console.log('API untilType: ' + untilType);
  // console.log('API untilDate: ' + untilDate);
  // console.log('API untilTimes: ' + untilTimes);
  // console.log('API frequencyType: ' + frequencyType);
  // console.log('tuesday: ' + weeklyTuesday);
  // console.log('API reminder time: ' + timeBefore);
  // console.log('API reminder unit: ' + beforeUnit);
  // console.log('API reminder type: ' + type);
  return http.post('calendarEvents', {
    body: {
      // no bracket since not an array
      title: title,
      startTime: startTime,
      endTime: endTime,
      location: location,
      notes: notes,
      recurrence: {
        untilType: untilType,
        untilDate: untilDate,
        untilTimes: untilTimes,
        frequencyType: frequencyType,
        weeklyMonday: weeklyMonday,
        weeklyTuesday: weeklyTuesday,
        weeklyWednesday: weeklyWednesday,
        weeklyThursday: weeklyThursday,
        weeklyFriday: weeklyFriday,
        weeklySaturday: weeklySaturday,
        weeklySunday: weeklySunday,
        weeklyEveryNWeeks: weeklyEveryNWeeks,
        monthlyEveryNMonths: monthlyEveryNMonths,
        monthlyWeekNumber: monthlyWeekNumber,
        yearlyWeekNumber: yearlyWeekNumber,
        yearlyEveryNYears: yearlyEveryNYears,
      },
      reminder: {
        timeBefore: timeBefore,
        beforeUnit: beforeUnit,
        type: type,
      },
      attendees: attendees,
    },
  });
}

export function getAppointmentDetails(apptID: string): Promise<AppointmentDetailsDataResponse> {
  return http.get(`calendarEvents/${apptID}`);
}

export function editAppointment(
  apptId: string,
  title: string,
  startTime: string,
  endTime: string,
  location: string,
  notes: string,
  attendees: AttendeesProps[]
): Promise<AddAppointmentDataResponse> {
  console.log('edit appointment: ' + apptId);
  return http.put(`calendarEvents/${apptId}`, {
    body: {
      // no bracket since not an array
      title: title,
      startTime: startTime,
      endTime: endTime,
      location: location,
      notes: notes,
      //when attendees is empty, the API still expects an array
      //of 1 empty object
      attendees: (attendees?.length ?? 0) == 0 ? [{}] : attendees,
    },
  });
}
