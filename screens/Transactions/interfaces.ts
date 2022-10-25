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

// Transaction Details in Postman

export interface TransactionDetailsProps {
  id: string;
  transactionType: string;
  status: string;
  title: string;
  contacts: TxContactProps[];
  address: TxAddressProps;
  leadSource: string;
  probabilityToClose: string;
  listDate: string;
  closingDate: string;
  listAmount: string;
  projectedAmount: string;
  rateType: string;
  miscBeforeSplitFees: string;
  miscBeforeSplitFeesType: string;
  miscAfterSplitFees: string;
  miscAfterSplitFeesType: string;
  commissionPortion: string;
  commissionPortionType: string;
  grossCommision: string;
  incomeAfterSplitFees: string;
  additionalIncome: string;
  additionalIncomeType: string;
  interestRate: string;
  loanType: string;
  buyerCommission: string;
  buyerCommissionType: string;
  sellerCommission: string;
  sellerCommissionType: string;
  notes: string;
}

export interface TxContactProps {
  userID: string;
  contactName: string;
  typeOfContact: string;
  leadSource: string;
}

export interface TxAddressProps {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isFavorite: boolean;
}

export interface TransactionDetails {
  data: TransactionDetailsProps;
  error: string;
  status: string;
}

// Transaction Delete in Postman

export interface TransactionDeleteResponse {
  data: TransactionDeleteProps;
  error: string;
  status: string;
}
export interface TransactionDeleteProps {
  message: string;
}

// Transaction Type in Postman

export interface TransactionTypeDataResponse {
  data: TransactionTypeDataProps;
  error: string;
  status: string;
}
export interface TransactionTypeDataProps {
  userType: string;
  statuses: string[];
  leadSources: string[];
  leadSourcesLender: string[];
  transactionType: string[];
}

// Add Transaction in Postman

export interface AddOrEditTransactionDataResponse {
  data: AddOrEditTransactionProps;
  error: string;
  status: string;
}
export interface AddOrEditTransactionProps {
  id: number;
  transactionType: string;
  status: string;
  title: string;
  contacts: TransactionContacts[];
  address: TransactionAddress;
  leadSource: string;
  probabilityToClose: string;
  listDate: string;
  closingDate: string;
  listAmount: string;
  projectedAmount: string;
  rateType: string;
  miscBeforeSplitFees: string;
  miscBeforeSplitFeesType: string;
  miscAfterSplitFees: string;
  miscAfterSplitFeesType: string;
  commissionPortion: string;
  commissionPortionType: string;
  grossCommision: string;
  incomeAfterSplitFees: string;
  additionalIncome: string;
  additionalIncomeType: string;
  interestRate: string;
  loanType: string;
  buyerCommission: string;
  buyerCommissionType: string;
  sellerCommission: string;
  sellerCommissionType: string;
  notes: string;
}

export interface TransactionContacts {
  userID: string;
  contactName: string;
  typeOfContact: string;
  leadSource: string;
}

export interface TransactionAddress {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
