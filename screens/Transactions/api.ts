import { http } from '../../utils/http';
import { RolodexDataProps } from '../Goals/interfaces';
import {
  TransactionDataResponse,
  TxChangeStatusResponse,
  TransactionDetails,
  TransactionDeleteResponse,
  TransactionTypeDataResponse,
  AddOrEditTransactionDataResponse,
  TransactionContacts,
  TransactionAddress,
  TxContactProps
} from './interfaces';
import { AttendeesProps } from '../ToDo/interfaces';

export function getTransactionData(status: string, type: string): Promise<TransactionDataResponse> {
  return http.get(`deals?filter=${status}&lastItem=0&batchSize=100&dealType=${type}`);
} // back tick (`) only necessary for string interpolation

export function getTransactionDetails(dealID: string): Promise<TransactionDetails> {
  return http.get(`deal?id=${dealID}`);
} // back tick (`) only necessary for string interpolation

export function changeTxStatus(idDeal: number, newStatus: string): Promise<TxChangeStatusResponse> {
  console.log(idDeal);
  console.log(newStatus);
  var paramStatus = newStatus.toLocaleLowerCase();
  if (paramStatus == 'not converted') {
    paramStatus = 'Not Converted';
  }
  console.log('param status: ' + paramStatus);
  return http.post('dealChangeStatus', {
    body: { idDeal: idDeal, newStatus: paramStatus },
  });
}

export function deleteTx(dealID: number): Promise<TransactionDeleteResponse> {
  console.log(dealID);
  return http.delete(`dealDelete?id=${dealID}`);
}

export function getDealOptions(): Promise<TransactionTypeDataResponse> {
  return http.get(`dealOptions`);
} // back tick (`) only necessary for string interpolation

export function addOrEditOtherTransaction(
  id: number,
  transactionType: string,
  status: string,
  title: string,
  street: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  probabilityToClose: string,
  closingDate: string,
  projectedAmount: string,
  commissionPortion: string,
  commissionPortionType: string,
  additionalIncome: string,
  additionalIncomeType: string,
  notes: string,
  contacts: RolodexDataProps[]
): Promise<AddOrEditTransactionDataResponse> {
  var address: TransactionAddress = {
    street: street,
    street2: street2,
    city: city,
    state: state,
    zip: zip,
    country: country,
  };

  //console.log('contacts' + JSON.stringify(contacts));
  //console.log('contacts: ' + (contacts === undefined ? 'hello' : 'ddfd'));
  //console.log('notes: ' + notes);

  var newContacts = new Array();
  contacts.forEach((item, index) => {
      var contactProps: TxContactProps = {
        userID: item.id,
        contactName: item.firstName + ' ' + item.lastName,
        typeOfContact :'related',
        leadSource : ""
      };
      newContacts.push(contactProps);
    }); 

    console.log('contacts' + JSON.stringify(newContacts));
  return http.post('deal', {
    body: {
      id: id,
      transactionType: transactionType,
      status: status,
      title: title,
      contacts: newContacts,
      address: address,
      probabilityToClose: probabilityToClose,
      closingDate: closingDate,
      projectedAmount: projectedAmount,
      commissionPortion: commissionPortion,
      commissionPortionType: commissionPortionType,
      additionalIncome: additionalIncome,
      additionalIncomeType: additionalIncomeType,
      notes: notes,
    },
  });
}

export function addOrEditTransaction(
  id: number,
  transactionType: string,
  status: string,
  title: string,
  street: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  buyerLeadSource: string,
  sellerLeadSource: string,
  probabilityToClose: string,
  listDate: string,
  closingDate: string,
  listAmount: string,
  projectedAmount: string,
  rateType: string,
  miscBeforeSplitFees: string,
  miscBeforeSplitFeesType: string,
  miscAfterSplitFees: string,
  miscAfterSplitFeesType: string,
  commissionPortion: string,
  commissionPortionType: string,
  grossCommision: string,
  incomeAfterSplitFees: string,
  additionalIncome: string,
  additionalIncomeType: string,
  interestRate: string,
  loanType: string, // 1st (Loan Description in app)
  buyerCommission: string,
  buyerCommissionType: string,
  sellerCommission: string,
  sellerCommissionType: string,
  notes: string,
  buyer?: RolodexDataProps | null | undefined,
  seller?: RolodexDataProps | null | undefined
): Promise<AddOrEditTransactionDataResponse> {
  var address: TransactionAddress = {
    street: street,
    street2: street2,
    city: city,
    state: state,
    zip: zip,
    country: country,
  };

  var txBuyer: TransactionContacts = {
    userID: buyer?.id ?? '',
    contactName: buyer?.firstName ?? '' + ' ' + buyer?.lastName ?? '',
    typeOfContact: 'Buyer',
    leadSource: buyerLeadSource,
  };

  var txSeller: TransactionContacts = {
    userID: seller?.id ?? '',
    contactName: seller?.firstName ?? '' + ' ' + seller?.lastName ?? '',
    typeOfContact: 'Seller',
    leadSource: sellerLeadSource,
  };

  var a = [];

  // Have to check transaction type below in case someone enters
  // a Buyer and Seller on screen 1 and then changes to just Buyer or just Seller

  if (seller != null && seller.id != '' && transactionType.includes('Seller')) {
    a.push(txSeller);
  }
  if (
    buyer != null &&
    buyer.id != '' &&
    (transactionType.includes('Buyer') || transactionType.includes('Purchase') || transactionType.includes('Refinance'))
  ) {
    a.push(txBuyer);
  }

  return http.post('deal', {
    body: {
      id: id,
      transactionType: transactionType,
      status: status,
      title: title,
      contacts: a,
      address: address,
      probabilityToClose: probabilityToClose,
      listDate: listDate,
      closingDate: closingDate,
      listAmount: listAmount,
      projectedAmount: projectedAmount,
      rateType: rateType,
      miscBeforeSplitFees: miscBeforeSplitFees,
      miscBeforeSplitFeesType: miscBeforeSplitFeesType,
      miscAfterSplitFees: miscAfterSplitFees,
      miscAfterSplitFeesType: miscAfterSplitFeesType,
      commissionPortion: commissionPortion,
      commissionPortionType: commissionPortionType,
      grossCommision: grossCommision,
      incomeAfterSplitFees: incomeAfterSplitFees,
      additionalIncome: additionalIncome,
      additionalIncomeType: additionalIncomeType,
      interestRate: interestRate,
      loanType: loanType,
      buyerCommission: buyerCommission,
      buyerCommissionType: buyerCommissionType,
      sellerCommission: sellerCommission,
      sellerCommissionType: sellerCommissionType,
      notes: notes,
    },
  });
}
