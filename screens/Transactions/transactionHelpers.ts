export const statusMenu = ['Potential', 'Active', 'Pending', 'Closed', 'Not Converted', 'Cancel'];
export const realtorTypeMenu = ['Buyer', 'Seller', 'Buyer & Seller', 'Cancel'];
export const lenderTypeMenu = ['Purchase Loan', 'Refinance', 'Cancel'];
export const otherTypeMenu = ['Lease', 'Referral Fee', 'Cancel'];
export const loanTypeMenu = ['Fixed', 'ARM', 'Interest Only', 'Other', 'Cancel'];
export const probabilityMenu = ['Uncertain', 'Maybe', 'Likely', 'Very Likely', 'Certain', 'Cancel'];

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
