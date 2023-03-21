import { getAppointmentDetails, addNewAppointmentTest } from './api';

const title = 'ApptTestTitle';
const startTime = '2022-09-20T00:00:00.00-08:00';
const endTime = '2022-09-20T00:00:00.00-08:00';
const location = 'ApptLocationTest';
const notes = 'ApptTestNotes';
const untilType = 'Forever';
const frequencyType = 'never';
const timeBefore = 7;
const type_Reminder = 'text';

export function testAddAppointment() {
  addAppointmentAPI();
}

function addAppointmentAPI() {
  addNewAppointmentTest(title, startTime, endTime, location, notes, untilType, frequencyType, timeBefore, type_Reminder)
    .then((res) => {
      if (res.status == 'error') {
        console.log(res);
        console.error(res.error);
      } else {
        console.log(res.data.reminder.timeBefore);
        getAppointmentDetailsAPI(res.data.id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}
function getAppointmentDetailsAPI(apptID: string) {
  getAppointmentDetails(apptID)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (
          res.data.title == title &&
          res.data.location == location &&
          res.data.notes == notes &&
          res.data.recurrence.frequencyType == 'never' &&
          res.data.reminder.timeBefore == timeBefore &&
          res.data.reminder.type == type_Reminder
        ) {
          console.log('add appointment test passed');
        } else {
          console.log('add appointment test failed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
