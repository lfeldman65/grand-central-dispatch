import { scheduleToDoNotifications, getNotificationStatus } from '../utils/general';
import { getToDoData } from '../screens/ToDo/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';
import { storage } from '../utils/storage';

export async function handleToDoNotifications() {
  for (var i = 2; i < 7; i++) {
    var identifier = await storage.getItem('todo-notification-' + i);
    console.log('received from storage ' + identifier);
    if (identifier != null) cancelScheduledNotificationAsync(identifier);
  }
  if (await hasToDoNotifications()) {
    fetchToDoInfo();
  }
}

async function fetchToDoInfo() {
  getToDoData('0')
    .then(async (res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        for (var i = 2; i < 7; i++) {
          await scheduleToDoNotifications(i, res.data.length.toString());
        }
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
