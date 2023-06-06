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
  console.log('someName: ' + someWord);
  var isAlpha = false;
  lettersArray.map((letter) => {
    if (someWord.substring(0, 1).toUpperCase() == letter) {
      isAlpha = true;
    }
  });
  return isAlpha;
}
