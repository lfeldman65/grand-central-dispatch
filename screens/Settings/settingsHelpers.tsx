export const bizTypeMenuOld = {
  Realtor: 'Realtor',
  Lender: 'Lender',
  Both: 'Both',
};

export const bizTypeMenu = {
  Agent: 'Agent',
  Lender: 'Lender',
  'Both Agent and Lender': 'Both Agent and Lender',
};

export const timeZoneMenu = {
  'Atlantic Standard Time': 'Atlantic Standard Time',
  'Eastern Standard Time': 'Eastern Standard Time',
  'Central Standard Time': 'Central Standard Time',
  'Mountain Standard Time': 'Mountain Standard Time',
  'Pacific Standard Time': 'Pacific Standard Time',
};

export const landingPages = [
  'Dashboard',
  'Goals',
  'Priority Action Center',
  'Video History',
  'Manage Relationships',
  'Recent Contact Activity',
  'Real Estate Transactions',
  'Lender Transactions',
  'Other Transactions',
  'Pop-By',
  'To-Do',
  'Calendar',
  'Podcasts',
];

export const displayAZRows = ['First Last', 'Last, First'];

export const lightOrDarkRows = ['automatic', 'light', 'dark'];

export const notificationRowsWithVid = [
  'Calls',
  'To Dos',
  'Win The Day and Win the Week',
  'Pop-Bys',
  'Import Relationships',
  'Videos',
];

export const notificationRowsNoVid = [
  'Calls',
  'To Dos',
  'Win The Day and Win the Week',
  'Pop-Bys',
  'Import Relationships',
];

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
  console.log('value: ' + value);
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
