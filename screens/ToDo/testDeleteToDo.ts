import { addNewToDo, getToDoData, deleteToDo } from './api';

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

// Add To-Do
// Fetch all To-Dos
// Make sure new To-Do in list
// Delete new To-Do
// Fetch all To-Dos
// Make sure new To-Do is not in 2nd list

export function testDeleteToDo() {
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
        getToDosBeforeDelete(res.data.id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function getToDosBeforeDelete(id: string) {
  getToDoData('all')
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        res.data.forEach((item, index) => {
          if (item.id == id) {
            deleteNewTodo(item.id);
          }
        });
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function deleteNewTodo(id: string) {
  deleteToDo(id)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        getToDosAfterDelete(id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function getToDosAfterDelete(id: string) {
  getToDoData('all')
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        var match = false;
        res.data.forEach((item, index) => {
          if (item.id == id) {
            match = true;
          }
        });
        if (match) {
          console.log('delete to-do test failed');
        } else {
          console.log('delete to-do test passed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
