export interface LoginDataResponse {
  data: LoginDataProps;
  error: string;
  status: string;
}

export interface LoginDataProps {
  token: string;
  status: string;
}
