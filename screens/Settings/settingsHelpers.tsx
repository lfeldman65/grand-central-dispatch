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
