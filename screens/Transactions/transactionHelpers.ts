import { StyleSheet } from 'react-native';

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

export const loanTypeDescriptionMenu = {
  '1st': '1st',
  '2nd': '2nd',
  '3rd': '3rd',
  Equity: 'Equity', // not done
};

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

export function prettyText(uglyText: string) {
  if (uglyText == 'automatic') {
    return 'Automatic';
  }
  if (uglyText == 'light') {
    return 'Light';
  }
  if (uglyText == 'dark') {
    return 'Dark';
  }
}

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

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  topContainer: {
    height: '93%',
  },
  mainContent: {
    alignItems: 'center',
  },
  backAndNext: {
    color: 'white',
    fontSize: 18,
    opacity: 1.0,
  },
  backAndNextDim: {
    color: 'white',
    fontSize: 18,
    opacity: 0.4,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    marginBottom: 5,
    textAlign: 'left',
    marginTop: 10,
  },
  summaryText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
    marginTop: 10,
    fontSize: 16,
  },
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 10,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: '7%',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
  },
  dollarAndPercentRow: {
    flexDirection: 'row',
  },
  percentView: {
    backgroundColor: '#002341',
    height: 50,
    width: '7%',
  },
  dollarView: {
    backgroundColor: '#002341',
    height: 50,
    width: '5%',
  },
  dollarAndPercentView: {
    backgroundColor: '#002341',
    width: '78%',
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  dollarText: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    paddingLeft: 10,
    opacity: 1.0,
  },
  dollarTextDim: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    paddingLeft: 10,
    opacity: 0.4,
  },
  percentText: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    opacity: 1.0,
  },
  percentTextDim: {
    fontSize: 20,
    color: '#02ABF7',
    marginTop: 12,
    opacity: 0.4,
  },
  notesViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  notesViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  noteTextDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  noteTextLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
  bottom: {
    height: 1000, // leave room for keyboard
  },
  placeholderText: {
    fontSize: 18,
    width: 300,
    color: '#AFB9C2',
  },
  closePicker: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
  attendeeView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    fontSize: 29,
    flexDirection: 'row',
  },
  attendeeInput: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    paddingLeft: 10,
    width: '92%',
  },
  addAttendee: {
    fontSize: 18,
    color: 'silver',
    width: 300,
  },
  deleteAttendeeX: {
    width: 10,
    height: 10,
  },
});
