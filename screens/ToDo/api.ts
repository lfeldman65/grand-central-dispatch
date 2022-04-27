import { http } from '../../utils/http';
import { ToDoDataResponse } from './interfaces';

export function getToDoData(type: string): Promise<ToDoDataResponse> {
  return http.get(`todos?filter=${type}&batchSize=10000&lastItem=0`);
}
