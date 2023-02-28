import { scheduleNotifications, getNotificationStatus, ga4Analytics } from '../../utils/general';

export async function testForNotificationPre(
  goalName: string,
  weeklyGoal: number,
  weeklyNum: number,
  dailyNum: number
) {
  var notifOn = await getNotificationStatus('notifWins');
  if (!notifOn) {
    return;
  }
  var dailyGoal = Math.ceil(weeklyGoal / 5);
  var newGoalName = goalName;
  if (goalName == 'Notes Made') {
    newGoalName = 'Notes Written';
  }
  if (goalName == 'Pop-By Made') {
    newGoalName = 'Pop-Bys Made';
  }
  console.log('TEST DAILY TITLE: ' + goalName);
  console.log('TEST DAILY GOAL: ' + dailyGoal);
  console.log('TEST WEEKLY GOAL: ' + weeklyGoal);
  console.log('TEST WEEKLY NUM: ' + weeklyNum);
  console.log('TEST DAILY NUM: ' + dailyNum);

  if (weeklyGoal == 0 && weeklyNum == 0) {
    // thresholds are 1 behind actual because we're getting values before this current activity
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Week for ' + newGoalName + '!', 1);
  } else if (weeklyGoal != 0 && weeklyNum == weeklyGoal - 1) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Week for ' + newGoalName + '!', 1);
  } else if (dailyGoal == 0 && dailyNum == 0) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Day for ' + newGoalName + '!', 1);
  } else if (dailyGoal != 0 && dailyNum == dailyGoal - 1) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Day for ' + newGoalName + '!', 1);
  }
}

export async function testForNotificationTrack(
  goalName: string,
  weeklyGoal: number,
  weeklyNum: number,
  dailyNum: number
) {
  var notifOn = await getNotificationStatus('notifWins');
  if (!notifOn) {
    return;
  }
  var dailyGoal = Math.ceil(weeklyGoal / 5);
  var newGoalName = goalName;
  if (goalName == 'Notes Made') {
    newGoalName = 'Notes Written';
  }
  if (goalName == 'Pop-By Made') {
    newGoalName = 'Pop-Bys Made';
  }
  console.log('TEST DAILY TITLE: ' + goalName);
  console.log('TEST DAILY GOAL: ' + dailyGoal);
  console.log('TEST WEEKLY GOAL: ' + weeklyGoal);
  console.log('TEST WEEKLY NUM: ' + weeklyNum);
  console.log('TEST DAILY NUM: ' + dailyNum);

  if (weeklyGoal == 0 && weeklyNum == 1) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Week for ' + newGoalName + '!', 1);
  } else if (weeklyGoal != 0 && weeklyNum == weeklyGoal) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Week for ' + newGoalName + '!', 1);
  } else if (dailyGoal == 0 && dailyNum == 1) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Day for ' + newGoalName + '!', 1);
  } else if (dailyGoal != 0 && dailyNum == dailyGoal) {
    scheduleNotifications('wins', 'Congratulations! 🏆', 'You Won the Day for ' + newGoalName + '!', 1);
  }
}
