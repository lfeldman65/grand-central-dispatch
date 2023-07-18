import { getToDoDetails, addNewToDo } from './api';

const title = 'ToDoTestTitle';
const goalID = 1;
const dueDate = '2023-03-18T00:00:00';
const priority = 'True';
const location = 'ToDoTestLocation';
const notes = 'ToDoTestNotes';
const untilType = 'Forever';
const untilDate = '';
const untilTimes = '';
const frequencyType = 'never';
const weeklyMonday = false;
const weeklyTuesday = false;
const weeklyWednesday = false;
const weeklyThursday = false;
const weeklyFriday = false;
const weeklySaturday = false;
const weeklySunday = false;
const weeklyEveryNWeeks = 0;
const monthlyEveryNMonths = 0;
const monthlyWeekNumber = 2;
const yearlyWeekNumber = 0;
const yearlyEveryNYears = 0;
const daysBefore = 1;
const type = 'none';

export function testAddToDo() {
  addToDoAPI();
}

function addToDoAPI() {
  var newAttendees = new Array();
  addNewToDo(
    title,
    goalID,
    dueDate,
    priority,
    location,
    notes,
    untilType,
    untilDate,
    untilTimes,
    frequencyType,
    weeklyMonday,
    weeklyTuesday,
    weeklyWednesday,
    weeklyThursday,
    weeklyFriday,
    weeklySaturday,
    weeklySunday,
    weeklyEveryNWeeks,
    monthlyEveryNMonths,
    monthlyWeekNumber,
    yearlyWeekNumber,
    yearlyEveryNYears,
    daysBefore,
    type,
    newAttendees
  )
    .then((res) => {
      if (res.status == 'error') {
        console.log(res);
        console.error(res.error);
      } else {
        getToDoDetailsAPI(res.data.id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function getToDoDetailsAPI(id: string) {
  getToDoDetails(id)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        console.log('dueDate: ' + res.data.dueDate);
        //   console.log('date: ' + date);
        if (
          res.data.title == title &&
          res.data.priority == 'True' &&
          res.data.notes == notes &&
          res.data.dueDate == '2023-03-18T00:00:00'
        ) {
          console.log('add new todo test passed');
        } else {
          console.log('add new todo test failed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
