import { schedulePACNotifications, getNotificationStatus } from '../utils/general';
import { getPACData } from '../screens/PAC/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

export async function handlePACNotifications() {
  console.log('cancel pac notifs');

  await cancelScheduledNotificationAsync('pac-notification-2');
  await cancelScheduledNotificationAsync('pac-notification-3');
  await cancelScheduledNotificationAsync('pac-notification-4');
  await cancelScheduledNotificationAsync('pac-notification-5');
  await cancelScheduledNotificationAsync('pac-notification-6');
  // await cancelScheduledNotificationAsync('pac-notification-7'); // sat

  if (await hasPACNotifications()) {
    fetchPACInfo();
  }
}

async function fetchPACInfo() {
  getPACData('calls')
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        schedulePACNotifications(2, res.data[0].contactName); // Monday
        schedulePACNotifications(3, res.data[0].contactName);
        schedulePACNotifications(4, res.data[0].contactName);
        schedulePACNotifications(5, res.data[0].contactName);
        schedulePACNotifications(6, res.data[0].contactName);
        //   schedulePACNotifications(7, res.data[0].contactName); // Sat
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
