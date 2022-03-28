// AZ Contacts in Postman

export interface RolodexDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  contactTypeID: string;
  employerName: string;
}

export interface RolodexDataResponse {
  data: RolodexDataProps[];
  error: string;
  status: string;
}

// Groups in Postman

export interface GroupsDataProps {
  id: string;
  groupName: string;
  groupSize: number;
  groupSizeLabel: string;
}

export interface GroupsDataResponse {
  data: GroupsDataProps[];
  error: string;
  status: string;
}

// Recent Activity in Postman

export interface RecentActivityDataProps {
  ContactId: string;
  ActivityType: string;
  ActivityTypeID: number;
  Name: string;
  Subject: string;
  Notes: string;
  ActivityDate: string;
}

export interface RecentActivityDataResponse {
  data: RecentActivityDataProps[];
  error: string;
  status: string;
}

// Add Contact in Postman

export interface AddContactDataProps {
  firstName: string;
  lastName: string;
  contactTypeID: string;
}

export interface AddContactDataResponse {
  data: AddContactDataProps[];
  error: string;
  status: string;
}
