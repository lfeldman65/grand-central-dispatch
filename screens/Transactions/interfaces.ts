// Transactions in Postman

export interface TransactionDataResponse {
  data: TransactionDataProps[];
  error: string;
  status: string;
}
export interface TransactionDataProps {
  id: number;
  contactName: string;
  title: string;
  closingDate: string;
}

// Change Transaction Status in Postman
export interface TxChangeStatusResponse {
  data: TxChangeStatusProps;
  error: string;
  status: string;
}
export interface TxChangeStatusProps {
  message: string;
}
