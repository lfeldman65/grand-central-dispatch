import { http } from '../../utils/http';
import {
  ProfileDataResponse,
  EditProfileDataResponse,
  BizGoalsDataResponse,
  BizGoalsSummaryDataResponse,
  AboutUsDataResponse,
  AddContactImportDataResponse,
  RolodexImportDataResponse,
} from './interfaces';
export function getProfileData(): Promise<ProfileDataResponse> {
  return http.get('setup/profile');
}

export function editProfileData(
  email: string,
  businessType: string,
  timezone: string,
  mobile: string,
  firstName: string,
  lastName: string,
  companyName: string,
  street1: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string
): Promise<EditProfileDataResponse> {
  return http.post('setup/profile', {
    body: {
      email: email,
      businessType: businessType,
      timezone: timezone,
      mobile: mobile,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
      country: country,
    },
  });
}

export function getBizGoals(): Promise<BizGoalsDataResponse> {
  return http.get('setup/goals');
}

export function updateBizGoals(
  desiredSalary: string,
  taxRate: string,
  yearlyExpenses: string,
  myCommissionPercentage: string,
  averageSalePrice: string,
  averageSaleCommission: string,
  commissionType: string
): Promise<BizGoalsDataResponse> {
  return http.put('setup/goals', {
    body: {
      desiredSalary: desiredSalary,
      taxRate: taxRate,
      yearlyExpenses: yearlyExpenses,
      myCommissionPercentage: myCommissionPercentage,
      averageSalePrice: averageSalePrice,
      averageSaleCommission: averageSaleCommission,
      commissionType: commissionType,
    },
  });
}

export function getBizGoalsSummary(): Promise<BizGoalsSummaryDataResponse> {
  return http.get('setup/goalSummary');
}

export function getMedia(type: string): Promise<AboutUsDataResponse> {
  return http.get(`media?batchSize=50&lastItem=0&type=${type}`);
}

export function addNewContact(
  firstName: string,
  lastName: string,
  contactTypeID: string,
  employerName: string,
  referredByName: string = '',
  referredByID: string = '',
  homePhone: string = '',
  mobile: string = '',
  officePhone: string = '',
  email: string = '',
  notes: string = ''
): Promise<AddContactImportDataResponse> {
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
        homePhone: homePhone,
        mobile: mobile,
        officePhone: officePhone,
        email: email,
        contactTypeID: contactTypeID,
        businessAndCareer: {
          occupation: '',
          employerName: employerName,
          careerNotes: '',
        },
        referral: isReferral,
        notes: notes,
        referredBy: {
          name: referredByName,
          id: referredByID,
        },
      },
    ],
  });
}

export function getRolodexData(type: string): Promise<RolodexImportDataResponse> {
  console.log('get rolodex: ' + type);
  return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=100000`);
} // back tick (`) only necessary for string interpolation
