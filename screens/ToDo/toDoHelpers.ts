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

export const reminderMenu = {
  None: 'None',
  '1 day before': '1 day before',
  '2 days before': '2 days before',
  '3 days before': '3 days before',
  '4 days before': '4 days before',
  '5 days before': '5 days before',
  '6 days before': '6 days before',
  '7 days before': '7 days before',
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
