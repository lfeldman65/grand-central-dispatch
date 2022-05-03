// Transactions in Postman

export interface TransactionDataProps {
  id: number;
  contactName: string;
  title: string;
  closingDate: string;
}

export interface TransactionDataResponse {
  data: TransactionDataProps[];
  error: string;
  status: string;
}
