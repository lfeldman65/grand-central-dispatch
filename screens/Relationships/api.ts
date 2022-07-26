import { http } from '../../utils/http';
import {
  RolodexDataResponse,
  RelDetailsResponse,
  GroupsDataResponse,
  AddContactDataResponse,
  RecentActivityDataResponse,
  VideoHistoryDataResponse,
  VideoDetailsDataResponse,
  ToDoAndApptResponse,
  ContactDeleteDataResponse,
} from './interfaces';

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=250`);
} // back tick (`) only necessary for string interpolation

export function getToDos(guid: string): Promise<ToDoAndApptResponse> {
  return http.get(`GetContactCalendarTodos/${guid}`);
} // back tick (`) only necessary for string interpolation

export function getRelDetails(guid: string): Promise<RelDetailsResponse> {
  return http.get(`contactsRN/${guid}`);
} // back tick (`) only necessary for string interpolation

export function getGroupsData(): Promise<GroupsDataResponse> {
  return http.get('groups?batchSize=500&lastItem=0');
}

export function addNewContact(
  firstName: string,
  lastName: string,
  contactTypeID: string,
  employerName: string,
  referredByName: string = '',
  referredByID: string = ''
): Promise<AddContactDataResponse> {
  console.log(referredByName);
  console.log(referredByID);
  var isReferral = false;
  if (referredByID != '') {
    isReferral = true;
  }
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
        referral: isReferral,
        referredBy: {
          name: referredByName,
          id: referredByID,
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

export function getVideoDetails(vidGuid: string): Promise<VideoDetailsDataResponse> {
  return http.get(`videoViews?videoGuid=${vidGuid}`);
}

export function deleteRelationship(guid: string): Promise<ContactDeleteDataResponse> {
  return http.delete(`contacts/${guid}`);
}
