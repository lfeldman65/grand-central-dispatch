import { timestampInSeconds } from '@sentry/utils';
import { http } from '../../utils/http';
import {
  ToDoDataResponse,
  ToDoDetailsDataResponse,
  ToDoMarkCompleteDataResponse,
  ToDoDeleteDataResponse,
  AddToDoDataResponse,
  RolodexDataResponse,
  AttendeesProps,
} from './interfaces';

export function getToDoData(type: string): Promise<ToDoDataResponse> {
  return http.get(`todos?filter=${type}&batchSize=10000&lastItem=0`);
}

export function getToDoDetails(toDoID: string): Promise<ToDoDetailsDataResponse> {
  return http.get(`todos/${toDoID}`);
}

export function markCompleteToDo(toDoID: string): Promise<ToDoMarkCompleteDataResponse> {
  return http.post(`todosMarkComplete/${toDoID}`);
}

export function deleteToDo(toDoID: string): Promise<ToDoDeleteDataResponse> {
  return http.delete(`todos/${toDoID}`);
}

export function addNewToDo(
  title: string,
  dueDate: string,
  priority: boolean,
  location: string,
  notes: string,
  untilType: string,
  untilDate: string,
  untilTimes: string,
  frequencyType: string,
  weeklyMonday: boolean,
  weeklyTueday: boolean,
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
  daysBefore: number,
  type: string,
  attendees: AttendeesProps[]
): Promise<AddToDoDataResponse> {
  console.log('add new to do: ' + title);
  return http.post('todos', {
    body: {
      // no bracket since not an array
      title: title,
      dueDate: dueDate,
      priority: priority,
      location: location,
      notes: notes,
      recurrence: {
        untilType: untilType,
        untilDate: untilDate,
        untilTimes: untilTimes,
        frequencyType: frequencyType,
        weeklyMonday: weeklyMonday,
        weeklyTueday: weeklyTueday,
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
        daysBefore: daysBefore,
        type: type,
      },
      attendees: attendees,
    },
  });
}

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getRolodexSearch(searchParam: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?batchSize=50&lastItem=0&sortType=alpha&search=${searchParam}`);
} // back tick (`) only necessary for string interpolation
