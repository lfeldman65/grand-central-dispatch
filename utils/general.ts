import { Linking } from 'react-native';
import openMap from 'react-native-open-maps';
import * as Notifications from 'expo-notifications';
import { storage } from './storage';
import { Platform } from 'react-native';
import analytics from "@react-native-firebase/analytics";
import * as SMS from 'expo-sms';

export function shouldRunTests() {
  return true;
}

export function isNullOrEmpty(value: any) {
  if (value == null) return true;
  if (value == '') return true;
  return false;
}

export function prettyTime(uglyTime?: string) {
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

export async function schedulePACNotifications(day: number, person: string) {
  // console.log('shedule PAC Notifs');
  const schedulingOptions = {
    content: {
      title: "Top O' the Morning to You!",
      body: 'Time to make your first call to ' + person + '!',
      sound: true,
      data: {
        id: 'pac-notification-' + day.toString(),
      },
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: 'blue',
    },
    trigger: {
      hour: 9,
      minute: 0,
      //   second: 0,
      weekday: day,
      repeats: true,
      //  repeat: 'week',
    },
  };
  var identifier = await Notifications.scheduleNotificationAsync(schedulingOptions);
  //  console.log('pac notification ' + identifier);
  await storage.setItem('pac-notification-' + day.toString(), identifier);
  return identifier;
}

export async function scheduleToDoNotifications(day: number, count: string) {
  //  console.log('shedule ToDo Notifs');
  var message = '';
  if (count == '0') {
    message = "You're all caught up for today! Tap here to see other To Dos";
  } else if (count == '1') {
    message = 'You have 1 To Do Today!';
  } else {
    message = 'You have ' + count.toString() + ' To Dos today!';
  }
  const schedulingOptions = {
    content: {
      title: "Top O' the Morning to You!",
      body: message,
      sound: true,
      data: {
        id: 'todo-notification-' + day.toString(),
      },
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: 'blue',
    },
    trigger: {
      hour: 9,
      minute: 15,
      //  second: 0,
      weekday: day,
      repeats: true,
      //  repeat: 'week',
    },
  };
  var identifier = await Notifications.scheduleNotificationAsync(schedulingOptions);
  //  console.log('todo notification ' + JSON.stringify(identifier));
  await storage.setItem('todo-notification-' + day.toString(), identifier);
  return identifier;
}
export async function getNotificationStatus(key: string) {
  var notifStatus = await storage.getItem(key);
  if (notifStatus == null || notifStatus == undefined) {
    return true;
  }
  if (notifStatus == 'true') {
    return true;
  }
  return false;
}

export function determineDeviceType() {
  if (Platform.OS === 'ios') return 'iOS';
  return 'Android';
}

export function ga4Analytics(mainEvent: string, other: any) {
  //  console.log('MAINEVENT:' + mainEvent);
  //Analytics.logEvent(mainEvent + '_' + determineDeviceType(), other);
  
  analytics().logEvent(mainEvent + '_' + determineDeviceType(), {
    additionaParam: other,
    });

}

export async function handleTextPressed(number: string, cb?: () => void) {
  const isAvailable = await SMS.isAvailableAsync();
  const timer = setInterval(async () => {
    clearInterval(timer);
    console.log('ISAVAILABLE: ' + isAvailable);
    if (isAvailable) {
      await SMS.sendSMSAsync(number, '');
      if (typeof cb !== 'undefined') {
        console.log('ISAVAILABLE: ' + isAvailable);
        console.log('Handle text pressed: ' + isAvailable);
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
