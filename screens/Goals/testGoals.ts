import { getGoalData, trackAction } from './api';

var todayAchieved = 0;

export function goalTests() {
  fetchGoals(false);
}

function fetchGoals(shouldCompare: boolean) {
  getGoalData()
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (shouldCompare) {
          if (res.data[0].achievedToday == todayAchieved + 1) {
            console.log('Goal write and read test passed');
          } else {
            console.log('Goal tests failed');
          }
        } else {
          todayAchieved = res.data[0].achievedToday;
          trackThisAction();
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function trackThisAction() {
  trackAction(
    '340a4091-a74d-4f5a-aaaa-4c5f151692ce',
    '1',
    '340a4091-a74d-4f5a-aaaa-4c5f151692ce',
    false,
    false,
    'testsubject',
    '2023-03-15T12:00:00.00-08:00',
    true,
    'testnote',
    false
  )
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        fetchGoals(true);
      }
    })
    .catch((error) => {
      console.log('complete error' + error);
    });
  return true;
}
