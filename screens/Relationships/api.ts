import { consoleSandbox } from '@sentry/utils';
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
  GroupMembersDataResponse,
  RemoveGroupMemberDataResponse,
  AddGroupMemberDataResponse,
} from './interfaces';

export function getRolodexData(type: string): Promise<RolodexDataResponse> {
  console.log('api type:' + type);
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=100`);
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

export function getGroupMembers(groupID: string): Promise<GroupMembersDataResponse> {
  console.log('get group members');
  return http.get(`contacts?sortType=alpha&groupID=${groupID}&lastItem=0&batchSize=100`);
}

export function getGroupMembersSearch(groupID: string, searchParam: string): Promise<GroupMembersDataResponse> {
  console.log('get group members search');
  return http.get(`contacts?sortType=alpha&search=${searchParam}&groupID=${groupID}&lastItem=0&batchSize=100`);
}

export function removeGroupMember(groupID: string, guid: string): Promise<RemoveGroupMemberDataResponse> {
  console.log('remove group member');
  return http.get(`removeContactFromGroup?contactGUID=${guid}&groupID=${groupID}`);
}

export function addRelToGroup(groupID: string, guid: string): Promise<AddGroupMemberDataResponse> {
  console.log('add group member');
  return http.get(`addContactToGroup?contactGUID=${guid}&groupID=${groupID}`);
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

export function changeRankAndQual(guid: string, rank: string, qual: string): Promise<RelDetailsResponse> {
  return http.put(`contacts/${guid}`, {
    body: { ranking: rank, qualified: qual },
  });
}

export function editContact(
  guid: string,
  rank: string,
  qual: string,
  first: string,
  last: string,
  mobile: string,
  homePhone: string,
  officePhone: string,
  email: string,
  website: string,
  street1: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  genNotes: string,
  relOrBiz: string,
  children: string,
  personalNotes: string,
  company: string,
  services: string,
  bizNotes: string,
  interests: string
): Promise<RelDetailsResponse> {
  console.log('api last:' + last);
  return http.put(`contacts/${guid}`, {
    body: {
      ranking: rank,
      qualified: qual,
      firstName: first,
      lastName: last,
      mobile: mobile,
      homePhone: homePhone,
      officePhone: officePhone,
      email: email,
      website: website,
      address: {
        street: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        country: country,
      },
      notes: genNotes,
      contactTypeID: relOrBiz,
      personalAndFamily: {
        childrensNames: children,
        personalNotes: personalNotes,
      },
      businessAndCareer: {
        employerName: company,
        occupation: services,
        careerNotes: bizNotes,
      },
      interestsAndFavorites: {
        notes: interests,
      },
    },
  });
}
