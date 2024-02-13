export function convertReminderUnit(unit: string) {
  console.log('unit: ' + unit);
  if (unit == null) {
    return 'None';
  }
  if (unit == '') {
    return 'None';
  }
  if (unit == 'None') {
    return 'None';
  }
  if (unit == 'Minutes') {
    return 'minutes';
  }
  if (unit == 'Hours') {
    return 'hours';
  }
  if (unit == 'Days') {
    return 'days';
  }
  if (unit == 'Weeks') {
    return 'weeks';
  }
  return 'None';
}

export function convertReminderTime(timeString: string) {
  console.log('timeString: ' + timeString);
  if (timeString == null) {
    return 0;
  }
  if (timeString == '') {
    return 0;
  }
  return parseInt(timeString);
}

export function getMonthNumber(prettyDate: string) {
  if (prettyDate.includes('Jan')) {
    return '01';
  }
  if (prettyDate.includes('Feb')) {
    return '02';
  }
  if (prettyDate.includes('Mar')) {
    return '03';
  }
  if (prettyDate.includes('Apr')) {
    return '04';
  }
  if (prettyDate.includes('May')) {
    return '05';
  }
  if (prettyDate.includes('Jun')) {
    return '06';
  }
  if (prettyDate.includes('Jul')) {
    return '07';
  }
  if (prettyDate.includes('Aug')) {
    return '08';
  }
  if (prettyDate.includes('Sep')) {
    return '09';
  }
  if (prettyDate.includes('Oct')) {
    return '10';
  }
  if (prettyDate.includes('Nov')) {
    return '11';
  }
  return '12';
}

export function getDayNumber(prettyDate: string) {
  // input sample: Mon Nov 14 2022 12:00:00 GMT-0800
  let datePieces = prettyDate.split(' ');
  return datePieces[2];
}

export function getYear(prettyDate: string) {
  // input sample: Mon Nov 14 2022 12:00:00 GMT-0800
  let datePieces = prettyDate.split(' ');
  return datePieces[3];
}

export function makeLongTxtPretty(longText: string, maxChar: number) {
  //console.log(longText.length);
  if (longText.length <= maxChar) {
    return longText;
  }
  return longText.substring(0, maxChar) + ' . . .';
}

export const apptStartDateLabel = 'Start Date';
export const apptStartTimeLabel = 'Start Time';
export const apptEndDateLabel = 'End Date';
export const apptEndTimeLabel = 'End Time';
export const apptDetailStartLabel = 'Start';
export const apptDetailEndLabel = 'End';
