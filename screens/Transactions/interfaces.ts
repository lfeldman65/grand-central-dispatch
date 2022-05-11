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

// ? in Postman
export interface TxChangeStatusProps {
  idDeal: number;
  newStatus: string;
}

export interface TxChangeStatusResponse {
  data: TxChangeStatusProps;
  error: string;
  status: string;
}
