// AZ Contacts in Postman
export interface RolodexDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  contactTypeID: string;
  employerName: string;
  qualified: boolean;
}

export interface RolodexDataResponse {
  data: RolodexDataProps[];
  error: string;
  status: string;
}

// Contact Events in Postman

export interface ToDoAndApptProps {
  EventID: string;
  EventType: string;
  Title: string;
  DateToUse: string;
  IsAllDay: boolean;
  IsToDo: boolean;
}

export interface ToDoAndApptResponse {
  data: ToDoAndApptProps[];
  error: string;
  status: string;
}

// Contact Details in Postman

export interface RelDetailsProps {
  id: string;
  userID: string;
  contactID: number;
  firstName: string;
  lastName: string;
  referral: string;
  isPastReferral: string;
  referredBy: RelDetailsReferredBy;
  ranking: string;
  qualified: string;
  mobile: string;
  homePhone: string;
  officePhone: string;
  email: string;
  spouse: RelDetailsSpouse;
  website: string;
  address: RelDetailsAddress;
  notes: string;
  contactTypeID: string;
  personalAndFamily: RelDetailsPersonal;
  businessAndCareer: RelDetailsBiz;
  interestsAndFavorites: RelDetailsInterests;
  bombBombAPIKey: string;
  hasBombBombPermission: boolean;
  historyNotes: RelDetailsHistory[];
  groupsNotes: RelDetailsGroups[];
  transactionNotes: string;
  transactions: RelDetailsTransactions[];
}

export interface RelDetailsHistory {
  activityDateTime: string;
  activityType: string;
  subject: string;
  notes: string;
}

export interface RelDetailsTransactions {
  dealId: number;
  transactionName: string;
  transactionStatus: string;
  closingPrice: number;
  closingDate: string;
  transactionType: string;
}

export interface RelDetailsGroups {
  groupId: string;
  groupName: string;
}

export interface RelDetailsReferredBy {
  name: string;
  id: string;
}

export interface RelDetailsSpouse {
  name: string;
  id: string;
}

export interface RelDetailsPersonal {
  birthday: string;
  weddingAnniversary: string;
  childrensNames: string;
  personalNotes: string;
}

export interface RelDetailsAddress {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isFavorite: string;
}

export interface RelDetailsBiz {
  occupation: string;
  employerName: string;
  careerNotes: string;
}

export interface RelDetailsInterests {
  notes: string;
}
export interface RelDetailsResponse {
  data: RelDetailsProps;
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

// Group Members in Postman

export interface GroupMembersDataResponse {
  data: GroupMembersDataProps[];
  error: string;
  status: string;
}

export interface GroupMembersDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  contactTypeID: string;
}

// Remove Contact From Group in Postman

export interface RemoveGroupMemberDataProps {
  message: string;
}

export interface RemoveGroupMemberDataResponse {
  data: RemoveGroupMemberDataProps[];
  error: string;
  status: string;
}

// Add Contact To Group in Postman

export interface AddGroupMemberDataProps {
  message: string;
}

export interface AddGroupMemberDataResponse {
  data: AddGroupMemberDataProps[];
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
  id: string;
  firstName: string;
  lastName: string;
  contactTypeID: string;
}

export interface AddContactDataResponse {
  data: AddContactDataProps[];
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

// Video History Summary in Postman

export interface VideoSummaryDataProps {
  videoTitle: string;
  videoGuid: string;
  viewCount: number;
}

export interface VideoHistoryDataResponse {
  data: VideoSummaryDataProps[];
  error: string;
  status: string;
}

// Video Details in Postman

export interface VideoDetailsDataProps {
  id: string;
  videoTitle: string;
  videoGuid: string;
  contactGuid: string;
  fullName: string;
  dateViewed: string;
  isAnonymous: boolean;
}

export interface VideoDetailsDataResponse {
  data: VideoDetailsDataProps[];
  error: string;
  status: string;
}

// Get Video Notification in Postman

export interface VideoNotificationDataProps {
  summary: string;
  hasNewViews: string;
}

export interface VideoNotificatonDataResponse {
  data: VideoNotificationDataProps;
  error: string;
  status: string;
}

// Contact Delete in Postman

export interface ContactDeleteProps {
  message: string;
}

export interface ContactDeleteDataResponse {
  data: ContactDeleteProps;
  error: string;
  status: string;
}

export interface FileUpload {
  uri: string;
  name: string;
  type: string;
}
