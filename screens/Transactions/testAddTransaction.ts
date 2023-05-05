import { addOrEditTransaction } from './api';
import { RolodexDataProps } from '../ToDo/interfaces';
import { getTransactionDetails } from './api';

const id = 0;
const transactionType = 'Buyer';
const status = 'Closed';
const title = 'TestAddTx';
const street = 'TestTxStreet1';
const street2 = 'TestTxStreet2';
const city = 'TestTxCity';
const state = 'TestTxState';
const zip = '92083';
const country = 'TestTxCountry';
const buyerLeadSource = 'Advertising';
const sellerLeadSource = 'none';
const probabilityToClose = 'Certain';
const listDate = '2023-05-04T23:09:21.103Z';
const closingDate = '2023-05-04T23:09:21.103Z';
const listAmount = '500000';
const projectedAmount = '400000';
const rateType = 'Fixed';
const miscBeforeSplitFees = '0';
const miscBeforeSplitFeesType = 'dollar';
const miscAfterSplitFees = '1500';
const miscAfterSplitFeesType = 'dollar';
const commissionPortion = '50';
const commissionPortionType = 'percent';
const grossCommission = '120000';
const incomeAfterSplitFees = '57500';
const additionalIncome = '2000';
const additionalIncomeType = 'dollar';
const interestRate = '';
const loanType = '1st'; // loanDescription in app
const buyerCommission = '4';
const buyerCommissionType = 'percent';
const sellerCommission = '4';
const sellerCommissionType = 'percent';
const notes = 'TestTxNotes';
const buyerGuid = '340a4091-a74d-4f5a-aaaa-4c5f151692ce';
const buyerFirst = 'Abcdefghi';

export function testAddTransaction() {
  addTransaction();
}

function addTransaction() {
  var txBuyer1: RolodexDataProps = {
    id: buyerGuid,
    firstName: buyerFirst,
    lastName: '',
    ranking: '',
    contactTypeID: '',
    employerName: '',
    qualified: false,
    selected: false,
  };

  addOrEditTransaction(
    id,
    transactionType,
    status,
    title,
    street,
    street2,
    city,
    state,
    zip,
    country,
    buyerLeadSource,
    sellerLeadSource,
    probabilityToClose,
    listDate,
    closingDate,
    listAmount,
    projectedAmount,
    rateType,
    miscBeforeSplitFees,
    miscBeforeSplitFeesType,
    miscAfterSplitFees,
    miscAfterSplitFeesType,
    commissionPortion,
    commissionPortionType,
    grossCommission,
    incomeAfterSplitFees,
    additionalIncome,
    additionalIncomeType,
    interestRate,
    loanType,
    buyerCommission,
    buyerCommissionType,
    sellerCommission,
    sellerCommissionType,
    notes,
    txBuyer1 //   borrower
  )
    .then((res) => {
      if (res.status == 'error') {
        console.log(res);
        console.error(res.error);
      } else {
        console.log('tx id ' + res.data.id);
        fetchTxDetails(res.data.id.toString(), res.data.projectedAmount, res.data.title);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchTxDetails(dealID: string, projectedAmt: string, titleTx: string) {
  getTransactionDetails(dealID)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (projectedAmt == res.data.projectedAmount && titleTx == res.data.title) {
          console.log('add tx test passed');
        } else {
          console.log('add tx test failed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
