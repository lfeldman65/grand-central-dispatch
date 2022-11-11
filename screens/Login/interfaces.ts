// Login in Postman

export interface LoginDataResponse {
  data: LoginDataProps;
  error: string;
  status: string;
}

export interface LoginDataProps {
  token: string;
  status: string;
}

// Profile in Postman

export interface ProfileDataResponse {
  data: ProfileProps;
  error: string;
  status: string;
}

export interface ProfileProps {
  hasBombBombPermission: boolean;
  businessType: string;
  firstName: string;
}
