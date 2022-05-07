import { http } from '../../utils/http';
import {
  RolodexDataResponse,
  RelDetailsResponse,
  GroupsDataResponse,
  AddContactDataResponse,
  RecentActivityDataResponse,
  VideoHistoryDataResponse,
} from './interfaces';

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=100`);
} // back tick (`) only necessary for string interpolation

export function getRelDetails(guid: string): Promise<RelDetailsResponse> {
  return http.get(`contacts/${guid}`);
} // back tick (`) only necessary for string interpolation

export function getGroupsData(): Promise<GroupsDataResponse> {
  return http.get('groups?batchSize=500&lastItem=0');
}

//contacts/0dbd2d47-5a7a-4b61-b4f6-885876a1ff17

export function addNewContact(
  firstName: string,
  lastName: string,
  contactTypeID: string,
  employerName: string
): Promise<AddContactDataResponse> {
  return http.post('contacts', {
    body: [
      {
        firstName: firstName,
        lastName: lastName,
        contactTypeID: contactTypeID,
        businessAndCareer: {
          occupation: '',
          employerName: employerName,
          careerNotes: '',
        },
      },
    ],
  });
}

export function getRecentActivityData(type: string): Promise<RecentActivityDataResponse> {
  return http.get(`getRecentActivity?filter=${type}`);
}

export function getVideoSummaryData(): Promise<VideoHistoryDataResponse> {
  console.log('yep');
  return http.get('videossummary');
}
