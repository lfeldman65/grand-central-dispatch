import * as Notifications from 'expo-notifications';
import { storage } from './storage';
import { Platform } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import * as SMS from 'expo-sms';

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

export function scheduleNotifications(title: string, body: string, seconds: number) {
  console.log('SCHEDULE');
  const schedulingOptions = {
    content: {
      title: title,
      body: body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: 'blue',
    },
    trigger: {
      seconds: seconds,
    },
  };
  Notifications.scheduleNotificationAsync(schedulingOptions);
}

export async function getNotificationStatus(key: string) {
  var notifStatus = await storage.getItem(key);
  if (notifStatus == null || notifStatus == undefined) {
    console.log('RETURN TRUE');
    return true;
  }
  if (notifStatus == 'True') {
    console.log('RETURN TRUE');
    return true;
  }
  console.log('RETURN FALSE');
  return false;
}

export function determineDeviceType() {
  if (Platform.OS === 'ios') return 'iOS';
  return 'Android';
}

export function ga4Analytics(mainEvent: string, other: any) {
  console.log('MAINEVENT:' + mainEvent);
  Analytics.logEvent(mainEvent + '_' + determineDeviceType(), other);
}

export async function handleTextPressed(number: string) {
  const isAvailable = await SMS.isAvailableAsync();
  const timer = setInterval(() => {
    clearInterval(timer);
    console.log('ISAVAILABLE: ' + isAvailable);
    if (isAvailable) {
      SMS.sendSMSAsync(number, '');
    }
  }, 500);
}

export function shouldRunTests() {
  return false;
}
