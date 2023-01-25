// Profile in Postman

export interface ProfileDataResponse {
  data: ProfileDataProps;
  error: string;
  status: string;
}

export interface ProfileDataProps {
  email: string;
  businessType: string;
  timezone: string;
  mobile: string;
  firstName: string;
  lastName: string;
  companyName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  hasBombBombPermission: boolean;
}

// Edit Profile in Postman

export interface EditProfileDataResponse {
  data: EditProfileProps;
  error: string;
  status: string;
}

export interface EditProfileProps {
  email: string;
  businesstype: string;
  timezone: string;
  mobile: string;
  firstName: string;
  lastName: string;
  companyName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  hasBombBombPermission: boolean;
}

// Settings Biz Goals in Postman

export interface BizGoalsDataResponse {
  data: BizGoalsDataProps;
  error: string;
  status: string;
}

export interface BizGoalsDataProps {
  desiredSalary: string;
  taxRate: string;
  yearlyExpenses: string;
  myCommissionPercentage: string;
  averageSalePrice: string;
  averageSaleCommission: string;
  commissionType: string;
}

// Settings Goal Summary in Postman

export interface BizGoalsSummaryDataResponse {
  data: BizGoalsSummaryDataProps;
  error: string;
  status: string;
}

export interface BizGoalsSummaryDataProps {
  yearlyNetIncome: string;
  yearlyGrossIncome: string;
  yearlyTransactions: string;
  yearlyReferrals: string;
  yearlyContacts: string;
  monthlyNetIncome: string;
  monthlyGrossIncome: string;
  monthlyTransactions: string;
  monthlyReferrals: string;
  monthlyContacts: string;
  weeklyCalls: number;
  weeklyNotes: number;
  weeklyPopBys: number;
  dailyCalls: number;
  dailyNotes: number;
  dailyPopBys: number;
}

// About Us in Postman

export interface AboutUsDataProps {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  duration: number;
  authorName: string;
  type: string;
}

export interface AboutUsDataResponse {
  data: AboutUsDataProps[];
  error: string;
  status: string;
}

// AZ Contacts in Postman

export interface RolodexImportDataProps {
  id: string;
  firstName: string;
  lastName: string;
  ranking: string;
  contactTypeID: string;
  employerName: string;
  qualified: boolean;
  selected: boolean;
  homePhone: string;
  mobile: string;
  officePhone: string;
  email: string;
  notes: string;
  didChange: boolean;
}

export interface RolodexImportDataResponse {
  data: RolodexImportDataProps[];
  error: string;
  status: string;
}

// Add Contact in Postman Body

export interface AddContactImportDataProps {
  id: string;
  firstName: string;
  lastName: string;
  contactTypeID: string;
}

// Add Contact in Postman Return

export interface AddContactImportDataResponse {
  data: AddContactImportDataProps[];
  error: string;
  status: string;
}
