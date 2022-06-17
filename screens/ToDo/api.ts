import { http } from '../../utils/http';
import {
  ToDoDataResponse,
  ToDoDetailsDataResponse,
  ToDoMarkCompleteDataResponse,
  ToDoDeleteDataResponse,
} from './interfaces';

export function getToDoData(type: string): Promise<ToDoDataResponse> {
  return http.get(`todos?filter=${type}&batchSize=100&lastItem=0`);
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
