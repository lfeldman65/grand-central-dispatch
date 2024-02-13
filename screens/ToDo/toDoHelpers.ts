export const recurrenceMenu = [
  'Never',
  'Daily',
  'Everyday M-F',
  'Weekly on',
  'Monthly on the',
  'Every _ week of the month',
  'Yearly',
  'Cancel',
];

export const untilTypeMenu = ['Times', 'Forever', 'Until', 'Cancel'];

export const reminderMenu = [
  'None',
  '1 day before',
  '2 days before',
  '3 days before',
  '4 days before',
  '5 days before',
  '6 days before',
  '7 days before',
  'Cancel',
];

export const frequencyWeekMenu = [
  'Every Week',
  'Every 2 Weeks',
  'Every 3 Weeks',
  'Every 4 Weeks',
  'Every 8 Weeks',
  'Every 12 Weeks',
  'Cancel',
];

export const frequencyMonthMenu = [
  'Every Month',
  'Every 2 Months',
  'Every 3 Months',
  'Every 4 Months',
  'Every 5 Months',
  'Every 6 Months',
  'Cancel',
];

export const frequencyYearMenu = [
  'Every Year',
  'Every 2 Years',
  'Every 3 Years',
  'Every 4 Years',
  'Every 5 Years',
  'Every 6 Years',
  'Cancel',
];

export const orderMenu = ['First', 'Second', 'Third', 'Fourth', 'Last', 'Cancel'];

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
    return 7;
  }
  if (timeString.includes('8')) {
    return 8;
  }
  if (timeString.includes('12')) {
    return 12;
  }
  return 0;
}

export function convertReminder(timeString: string) {
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
  if (timeString.includes('1')) {
    return 1;
  }
  if (timeString.includes('2')) {
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
  return 7;
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

export const toDoFilters = ['All', 'Today', 'Week', 'Month', 'Overdue', 'Completed', 'Cancel'];

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
