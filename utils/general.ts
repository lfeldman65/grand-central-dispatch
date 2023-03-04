import { Linking } from 'react-native';
import openMap from 'react-native-open-maps';

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

export function scheduleNotifications(id: string, title: string, body: string, seconds: number) {
  console.log('SCHEDULE');
  const schedulingOptions = {
    content: {
      title: title,
      body: body,
      sound: true,
      data: {
        id: id,
      },
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
    console.log('RETURN Notif TRUE');
    return true;
  }
  if (notifStatus == 'true') {
    console.log('RETURN Notif 2 TRUE');
    return true;
  }
  console.log('RETURN Notif FALSE');
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

export async function handleTextPressed(number: string, cb?: () => void) {
  const isAvailable = await SMS.isAvailableAsync();
  const timer = setInterval(async () => {
    clearInterval(timer);
    console.log('ISAVAILABLE: ' + isAvailable);
    if (isAvailable) {
      await SMS.sendSMSAsync(number, '');
      if (typeof cb !== 'undefined') {
        const timer2 = setInterval(() => {
          clearInterval(timer2);
          cb();
        }, 500);
      }
    }
  }, 500);
}

export async function handleTextVideoBBPressed(number: string, url: string, cb?: () => void) {
  const isAvailable = await SMS.isAvailableAsync();
  const timer = setInterval(async () => {
    clearInterval(timer);
    console.log('ISAVAILABLE: ' + isAvailable);
    if (isAvailable) {
      SMS.sendSMSAsync([number ?? ''], 'Here is the video ' + url);
      if (typeof cb !== 'undefined') {
        const timer2 = setInterval(() => {
          clearInterval(timer2);
          cb();
        }, 500);
      }
    }
  }, 500);
}

export async function handleTextVideoAttachedPressed(number: string, result: any, cb?: () => void) {
  const isAvailable = await SMS.isAvailableAsync();
  const timer = setInterval(async () => {
    clearInterval(timer);
    console.log('ISAVAILABLE: ' + isAvailable);
    if (isAvailable) {
      await SMS.sendSMSAsync([number ?? ''], 'Here is the video', {
        attachments: {
          uri: result.uri,
          mimeType: 'video/mp4',
          filename: 'myvid.mp4',
        },
      });
      if (typeof cb !== 'undefined') {
        const timer2 = setInterval(() => {
          clearInterval(timer2);
          cb();
        }, 500);
      }
    }
  }, 500);
}

export async function handlePhonePressed(number: string, cb?: () => void) {
  const timer = setInterval(async () => {
    clearInterval(timer);
    Linking.openURL(`tel:${number}`);
    if (typeof cb !== 'undefined') {
      const timer2 = setInterval(() => {
        clearInterval(timer2);
        cb();
      }, 500);
    }
  }, 500);
}

export async function handleEmailPressed2(address: string, cb?: () => void) {
  const timer = setInterval(async () => {
    clearInterval(timer);
    Linking.openURL(`mailto:${address}`);
    if (typeof cb !== 'undefined') {
      const timer2 = setInterval(() => {
        clearInterval(timer2);
        cb();
      }, 500);
    }
  }, 500);
}

export async function handleMapPressed2(directions: string, cb?: () => void) {
  const timer = setInterval(async () => {
    clearInterval(timer);
    openMap({ query: directions });
    if (typeof cb !== 'undefined') {
      const timer2 = setInterval(() => {
        clearInterval(timer2);
        cb();
      }, 500);
    }
  }, 500);
}

export function shouldRunTests() {
  return false;
}
