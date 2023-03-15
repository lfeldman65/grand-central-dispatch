import { schedulePACNotifications, getNotificationStatus } from '../utils/general';
import { getPACData } from '../screens/PAC/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

export async function handlePACNotifications() {
  await cancelScheduledNotificationAsync('pac-notification');
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
