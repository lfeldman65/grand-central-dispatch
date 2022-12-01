export function isNullOrEmpty(value: any) {
  if (value == null) return true;
  if (value == '') return true;
  return false;
}

export function formatDate(datetime?: string) {
  if (datetime == null) return;
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return month + '/' + day + '/' + year;
}

export function formatDateTime(datetime?: string) {
  if (datetime == null) return;
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${month}/${day}/${year} ${time}`;
}

export function prettyDate(uglyDate: string) {
  // 2019-05-22T00:00:00"
  if (uglyDate == null) return '';
  if (uglyDate == '') return '';
  var dateOnly = uglyDate.substring(0, 10);
  var dateParts = dateOnly.split('-');
  var year = dateParts[0].substring(2, 4);
  // 05/22/2019
  return dateParts[1] + '/' + dateParts[2] + '/' + year;
}

export function prettyTime(uglyTime: string) {
  if (uglyTime == null) return ' ';
  if (uglyTime == '') return ' ';
  var timeOnly = uglyTime.substring(11, 16);
  //  console.log('time: ' + timeOnly);
  return timeOnly;
}
