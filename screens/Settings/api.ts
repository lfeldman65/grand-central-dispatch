import { http } from '../../utils/http';
import {
  ProfileDataResponse,
  EditProfileDataResponse,
  BizGoalsDataResponse,
  BizGoalsSummaryDataResponse,
  AboutUsDataResponse,
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
      email,
      businessType,
      timezone,
      mobile,
      firstName,
      lastName,
      companyName,
      street1,
      street2,
      city,
      state,
      zip,
      country,
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
