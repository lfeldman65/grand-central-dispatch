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
