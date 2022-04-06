import { http } from '../../utils/http';
import { ToDoDataResponse } from './interfaces';

export function getToDoData(): Promise<ToDoDataResponse> {
  console.log('yep');
  return http.get('todos?filter=all&batchSize=100&lastItem=0');
}
