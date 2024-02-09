export const ideasMenu = {
  Calls: 'Calls',
  Notes: 'Notes',
  'Pop-Bys': 'Pop-Bys',
};

export const vidMenu = {
  'Use Video Album': 'Use Video Album',
  'Use Video Camera': 'Use Video Camera',
};

export const mobileTypeMenu = {
  Call: 'Call',
  Message: 'Message',
};

export const homeTypeMenu = {
  Call: 'Call',
  Message: 'Message',
};

export const officeTypeMenu = {
  Call: 'Call',
  Message: 'Message',
};

export const relSheets = {
  callSheet: 'call_sheet_id',
  ideaSheet: 'idea_sheet_id',
  vidSheet: 'vid_sheet_id',
  mobileSheet: 'mobile_sheet_id',
  homeSheet: 'home_sheet_id',
  officeSheet: 'office_sheet_id',
};

export function displayName(first: string, last: string, type: string, employer: string, displayOrder: string) {
  if (type == 'Rel') {
    if (displayOrder == 'First Last') {
      return first + ' ' + last;
    }
    return last + ', ' + first;
  }
  return employer + ' (' + first + ')';
}

export function isFirstLetterAlpha(someWord: string) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lettersArray = letters.split('');
  var isAlpha = false;
  lettersArray.map((letter) => {
    if (someWord.substring(0, 1).toUpperCase() == letter) {
      isAlpha = true;
    }
  });
  return isAlpha;
}

export function prettyDate(uglyDate?: string) {
  // example: 2019-05-22T00:00:00"
  if (uglyDate == null) return '';
  if (uglyDate == '') return '';
  var dateOnly = uglyDate.substring(0, 10);
  var dateParts = dateOnly.split('-');
  var year = dateParts[0].substring(0, 4);
  // example: 05/22/2019
  return dateParts[1] + '/' + dateParts[2] + '/' + year;
}
