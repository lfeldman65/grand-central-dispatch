export const bizTypeMenu = {
  Realtor: 'Realtor',
  Lender: 'Lender',
  Both: 'Both',
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
  'To-Do',
  'Win The Day and Win the Week',
  'Pop-Bys',
  'Import Relationships',
  'Videos',
];

export const notificationRowsNoVid = [
  'Calls',
  'To-Do',
  'Win The Day and Win the Week',
  'Pop-Bys',
  'Import Relationships',
];

export function prettyText(uglyText: string) {
  console.log('ugly: ' + uglyText);
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
  if (value.includes('.')) {
    let noDecimalValue = value.split('.');
    console.log(noDecimalValue[0]);
    return noDecimalValue[0];
  }
  return value;
}

export function removeLeadingDecimal(value: string) {
  // i.e. 3129.27 -> 27
  if (value.includes('.')) {
    let noDecimalValue = value.split('.');
    return noDecimalValue[1];
  }
  return value;
}
