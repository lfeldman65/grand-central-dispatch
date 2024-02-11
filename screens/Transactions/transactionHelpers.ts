export const AddTxBuyerAndSellerSheets = {
  statusSheet: 'filter_sheet_status',
  typeSheet: 'filter_sheet_type',
  purchaseLoanTypeSheet: 'filter_sheet_purchase_loan_type',
  buyerSourceSheet: 'filter_sheet_buyer_lead_source',
  sellerSourceSheet: 'filter_sheet_seller_lead_source',
  borrowerSourceSheet: 'filter_sheet_seller_lead_source',
  addressSheet: 'filter_sheet_property_address',
  probabilitySheet: 'filter_sheet_probability',
  loanTypeSourceSheet: 'filter_sheet_loan_type',
  loanDescSourceSheet: 'filter_sheet_loan_desc',
  leaseOrRefFeeSheet: 'filter_sheet_lease_ref_fee',
};

export const statusMenu = {
  Potential: 'Potential',
  Active: 'Active',
  Pending: 'Pending',
  Closed: 'Closed',
  'Not Converted': 'Not Converted',
};

export const statusMenuNew = ['Potential', 'Active', 'Pending', 'Closed', 'Not Converted', 'Cancel'];

export const typeMenu = {
  Buyer: 'Buyer',
  Seller: 'Seller',
  'Buyer & Seller': 'Buyer & Seller',
};

export const purchaseLoanTypeMenu = {
  'Purchase Loan': 'Purchase Loan',
  Refinance: 'Refinance',
};

export const leaseOrRefFeeMenu = {
  Lease: 'Lease',
  'Referral Fee': 'Referral Fee',
};

export const loanTypeMenu = {
  Fixed: 'Fixed',
  ARM: 'ARM',
  'Interest Only': 'Interest Only',
  Other: 'Other',
};

// export const loanTypeDescriptionMenu = {
//   '1st': '1st',
//   '2nd': '2nd',
//   '3rd': '3rd',
//   Equity: 'Equity', // not done
// };

export const buyerLeadSourceMenu = {
  // not done, maybe api
  Advertising: 'Advertising',
  'Cold Calling': 'Cold Calling',
};

export const sellerLeadSourceMenu = {
  // not done, maybe api
  Advertising: 'Advertising',
  'Cold Calling': 'Cold Calling',
};

export const borrowerLeadSourceMenu = {
  // not done, maybe api
  Advertising: 'Advertising',
  'Cold Calling': 'Cold Calling',
};

export const propertyAddressMenu = {
  TBD: 'TBD',
  'Enter Manually': 'Enter Manually',
};

export const probabilityMenu = {
  Uncertain: 'Uncertain',
  Maybe: 'Maybe',
  Likely: 'Likely',
  'Very Likely': 'Very Likely',
  Certain: 'Certain',
};

export function removeTrailingDecimal(value: string) {
  // i.e. 3129.27 -> 3129
  if (value == null || value == '') {
    return '';
  }
  // console.log('value: ' + value);
  if (value.includes('.')) {
    let pieces = value.split('.');
    return pieces[0];
  }
  return value;
}

export function removeLeadingDecimal(value: string) {
  // i.e. 3129.27 -> 27
  if (value == null || value == '') {
    return '0';
  }
  if (value.includes('.')) {
    let pieces = value.split('.');
    return pieces[1];
  }
  return value;
}

export function roundToInt(value: string) {
  if (value == null || value == '') {
    return '0';
  }
  if (value.includes('.')) {
    let raw = parseFloat(value);
    let round = Math.round(raw);
    return round.toString();
  }
  return value;
}
