import { timestampInSeconds } from '@sentry/utils';
import { http } from '../../utils/http';
import {
  ToDoDataResponse,
  ToDoDetailsDataResponse,
  ToDoMarkCompleteDataResponse,
  ToDoDeleteDataResponse,
  AddToDoDataResponse,
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
  frequencyType: string,
  notes: string
): Promise<AddToDoDataResponse> {
  console.log('add new to do: ' + title);
  return http.post('todos', {
    body: {
      // no bracket since not an arrays
      title: title,
      dueDate: dueDate,
      priority: priority,
      location: location,
      notes: notes,
      recurrence: {
        frequencyType: frequencyType,
      },
    },
  });
}
