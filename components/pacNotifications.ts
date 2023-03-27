import { schedulePACNotifications, getNotificationStatus } from '../utils/general';
import { getPACData } from '../screens/PAC/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';
// import { cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import { storage } from '../utils/storage';

export async function handlePACNotifications() {
  for (var i = 2; i < 7; i++) {
    var identifier = await storage.getItem('pac-notification-' + i);
    console.log('received from storage ' + identifier);
    if (identifier != null) cancelScheduledNotificationAsync(identifier);
  }
  if (await hasPACNotifications()) {
    fetchPACInfo();
  }
}

async function fetchPACInfo() {
  getPACData('calls')
    .then(async (res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        for (var i = 2; i < 7; i++) {
          await schedulePACNotifications(i, res.data[0].contactName);
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

async function hasPACNotifications() {
  var notifOn = await getNotificationStatus('notifCall');
  if (notifOn == null) {
    return false;
  }
  if (!notifOn) {
    return false;
  }
  return true;
}
