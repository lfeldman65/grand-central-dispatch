export const bizTypeMenu = ['Agent', 'Lender', 'Both Agent and Lender', 'Cancel'];

export const timeZoneMenu = [
  'Atlantic Standard Time',
  'Eastern Standard Time',
  'Central Standard Time',
  'Mountain Standard Time',
  'Pacific Standard Time',
  'Cancel',
];

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

export function percentToDecimal(value: string) {
  // ex: "30" -> "0.3"
  if (value == null || value == '') {
    return '';
  }
  var valueNum = parseFloat(value); // 30
  valueNum = valueNum / 100; // .30
  return valueNum.toString(); // "0.3"
}

export function decimalToPercent(value: string) {
  // ex: ".30" -> "30"
  if (value == null || value == '') {
    return '';
  }
  var valueNum = parseFloat(value); // .30
  valueNum = valueNum * 100; // 30
  return valueNum.toString(); // "30"
}
