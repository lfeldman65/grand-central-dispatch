import { getGoalData, trackAction } from './api';

var todayAchievedBeforeTrack = 0;

const guid = '340a4091-a74d-4f5a-aaaa-4c5f151692ce';
const goalId = '1';
const contactGuid = '340a4091-a74d-4f5a-aaaa-4c5f151692ce';
const userGaveReferral = false;
const followUp = false;
const subject = 'testsubject';
const date2 = new Date();
const referral = true;
const notes = 'test goal notes';
const referralInPast = false;

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
          if (res.data[0].achievedToday == todayAchievedBeforeTrack + 1) {
            console.log('Goal write and read test passed');
          } else {
            console.log('Goal tests failed');
          }
        } else {
          todayAchievedBeforeTrack = res.data[0].achievedToday;
          trackThisAction();
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function trackThisAction() {
  var date = new Date();
  console.log(date);
  console.log(date.toISOString());
  console.log(date.toDateString());
  console.log(date.toLocaleDateString());

  trackAction(
    guid,
    goalId,
    contactGuid,
    userGaveReferral,
    followUp,
    subject,
    date2.toISOString(),
    referral,
    notes,
    referralInPast
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
