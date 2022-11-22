export const recurrenceMenu = {
  Never: 'Never',
  Daily: 'Daily',
  'Everyday M-F': 'Everyday M-F',
  'Weekly on': 'Weekly on',
  'Monthly on the': 'Monthly on the',
  'Every _ week of the month': 'Every _ week of the month',
  Yearly: 'Yearly',
};

export const untilTypeMenu = {
  Times: 'Times',
  Forever: 'Forever',
  Until: 'Until',
};

export const reminderUnitBeforeMenu = {
  None: 'None',
  Minutes: 'Minutes',
  Hours: 'Hours',
  Days: 'Days',
  Weeks: 'Weeks',
};

export const reminderTimeBeforeMenu = {
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  '60': '60',
};

export const frequencyWeekMenu = {
  'Every Week': 'Every Week',
  'Every 2 Weeks': 'Every 2 Weeks',
  'Every 3 Weeks': 'Every 3 Weeks',
  'Every 4 Weeks': 'Every 4 Weeks',
  'Every 8 Weeks': 'Every 8 Weeks',
  'Every 12 Weeks': 'Every 12 Weeks',
};

export const frequencyMonthMenu = {
  'Every Month': 'Every Month',
  'Every 2 Months': 'Every 2 Months',
  'Every 3 Months': 'Every 3 Months',
  'Every 4 Months': 'Every 4 Months',
  'Every 5 Months': 'Every 5 Months',
  'Every 6 Months': 'Every 6 Months',
};

export const frequencyYearMenu = {
  'Every Year': 'Every Year',
  'Every 2 Years': 'Every 2 Years',
  'Every 3 Years': 'Every 3 Years',
  'Every 4 Years': 'Every 4 Years',
  'Every 5 Years': 'Every 5 Years',
  'Every 6 Years': 'Every 6 Years',
};

export const orderMenu = {
  First: 'First',
  Second: 'Second',
  Third: 'Third',
  Fourth: 'Fourth',
  Last: 'Last',
};

export function convertRecurrence(rec: string) {
  if (rec == 'Never') return 'never';
  if (rec == 'Daily') return 'daily';
  if (rec == 'Everyday M-F') return 'everyweekday';
  if (rec == 'Weekly on') return 'weeklyon';
  if (rec == 'Monthly on the') return 'monthlyon';
  if (rec == 'Every _ week of the month') return 'everyxweekofmonth';
  if (rec == 'Yearly') return 'yearlyon';
  return 'never';
}

export function convertFrequency(timeString: string) {
  console.log('time string: ' + timeString);
  if (timeString == null) {
    return 0;
  }
  if (timeString == '') {
    return 0;
  }
  if (timeString == 'None') {
    return 0;
  }
  if (timeString.includes('Every Week')) {
    return 1;
  }
  if (timeString.includes('Every Month')) {
    return 1;
  }
  if (timeString.includes('Every Year')) {
    return 1;
  }
  if (timeString.includes('Every 2 Weeks')) {
    return 2;
  }
  if (timeString.includes('Every 2 Months')) {
    return 2;
  }
  if (timeString.includes('Every 2 Years')) {
    return 2;
  }
  if (timeString.includes('3')) {
    return 3;
  }
  if (timeString.includes('4')) {
    return 4;
  }
  if (timeString.includes('5')) {
    return 5;
  }
  if (timeString.includes('6')) {
    return 6;
  }
  if (timeString.includes('7')) {
    return 6;
  }
  if (timeString.includes('8')) {
    return 8;
  }
  if (timeString.includes('12')) {
    return 12;
  }
  return 0;
}

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
  console.log('days string: ' + timeString);
  if (timeString == null) {
    return 0;
  }
  if (timeString == '') {
    return 0;
  }
  if (timeString == 'None') {
    return 0;
  }
  if (timeString == '10') {
    return 10;
  }
  if (timeString == '20') {
    return 20;
  }
  if (timeString == '30') {
    return 30;
  }
  if (timeString == '40') {
    return 40;
  }
  if (timeString == '50') {
    return 50;
  }
  if (timeString == '60') {
    return 60;
  }
  return 0;
}

export function convertOrder(element: string) {
  if (element == null) {
    return 0;
  }
  if (element == '') {
    return 0;
  }
  if (element == 'First') {
    return 1;
  }
  if (element == 'Second') {
    console.log('daniel');
    return 2;
  }
  if (element == 'Third') {
    return 3;
  }
  if (element == 'Fourth') {
    return 4;
  }
  if (element == 'Last') {
    return 5;
  }
  return 0;
}

export function convertYearlyWeekNumber(element: string) {
  if (element == null) {
    return 0;
  }
  if (element == '') {
    return 0;
  }
  return 2;
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
