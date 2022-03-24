import { http } from '../../utils/http';
import { RolodexDataResponse } from './interfaces';
import { GroupsDataResponse } from './interfaces';

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=100`);
} // back tick (`) only necessary for string interpolation

export function getGroupsData(): Promise<GroupsDataResponse> {
  return http.get('groups?batchSize=500&lastItem=0');
}
