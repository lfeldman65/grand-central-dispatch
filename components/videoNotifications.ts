import { storage } from '../utils/storage';
import { scheduleNotifications, getNotificationStatus } from '../utils/general';
import { getVideoNotificationInfo } from '../screens/Relationships/api';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

export async function handleVideoNotifications() {
  var hasBombBombString = await storage.getItem('hasBombBomb');
  await cancelScheduledNotificationAsync('video-notification');
  if (hasBombBombString == 'true' && (await hasVideoNotifications()) && (await enoughTimePassedNotif(60 * 5))) {
    fetchVideoInfo();
  }
}

async function fetchVideoInfo() {
  console.log('yep');
  getVideoNotificationInfo()
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        console.log(res.data);
        if (res.data.hasNewViews) {
          scheduleNotifications('video-notification', 'Video Message', res.data.summary, 1);
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

async function hasVideoNotifications() {
  var notifOn = await getNotificationStatus('notifVideos');
  if (notifOn == null) {
    return false;
  }
  if (!notifOn) {
    return false;
  }
  return true;
}

async function enoughTimePassedNotif(secondsBetween: number) {
  // Must have at least y seconds between successive notifications
  var now = Date.now();
  const lastNotif = await storage.getItem('lastVidNotification');
  if (lastNotif == null) {
    storage.setItem('lastVidNotification', now.toString());
    return true;
  }
  const nextNotif = parseFloat(lastNotif) + secondsBetween * 1000;
  if (now > nextNotif) {
    storage.setItem('lastVidNotification', now.toString());
    return true;
  }
  return false;
}
