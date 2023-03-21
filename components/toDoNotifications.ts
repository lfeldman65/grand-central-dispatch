import { scheduleToDoNotifications, getNotificationStatus } from '../utils/general';
import { getToDoData } from '../screens/ToDo/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

export async function handleToDoNotifications() {
  console.log('cancel to do notifs');
  await cancelScheduledNotificationAsync('todo-notification-2');
  await cancelScheduledNotificationAsync('todo-notification-3');
  await cancelScheduledNotificationAsync('todo-notification-4');
  await cancelScheduledNotificationAsync('todo-notification-5');
  await cancelScheduledNotificationAsync('todo-notification-6');

  if (await hasToDoNotifications()) {
    fetchToDoInfo();
  }
}

async function fetchToDoInfo() {
  getToDoData('0')
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        scheduleToDoNotifications(1, res.data.length.toString()); // Monday
        scheduleToDoNotifications(2, res.data.length.toString());
        scheduleToDoNotifications(3, res.data.length.toString());
        scheduleToDoNotifications(4, res.data.length.toString());
        scheduleToDoNotifications(5, res.data.length.toString());
      }
    })
    .catch((error) => console.error('failure ' + error));
}

async function hasToDoNotifications() {
  var notifOn = await getNotificationStatus('notifToDo');
  if (notifOn == null) {
    return false;
  }
  if (!notifOn) {
    return false;
  }
  return true;
}
