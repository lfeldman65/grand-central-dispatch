export const ideasMenu = ['Calls', 'Notes', 'Pop-Bys', 'Cancel'];

export const vidMenu = ['Use Video Album', 'Use Video Camera', 'Cancel'];

export const mobileTypeMenu = ['Call', 'Message', 'Cancel'];

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

export const recentActivityFilters = ['All', 'Calls', 'Notes', 'Pop-Bys', 'Referral', 'Other', 'Cancel'];
