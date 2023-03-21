import { addNewAppointmentTest, getAppointments } from '../Calendar/api';
import { deleteToDo } from '../ToDo/api'; // change name because this api works for to-do's and appointments

const title = 'ApptTestTitle';
const startTime = '2023-03-20T00:00:00.00-08:00';
const endTime = '2023-03-20T00:00:00.00-08:00';
const location = 'ApptLocationTest';
const notes = 'ApptTestNotes';
const untilType = 'Forever';
const frequencyType = 'never';
const timeBefore = 7;
const type_Reminder = 'text';

// Add Appointment
// Fetch all Appointement
// Make sure new Appointment in list
// Delete new Appointment
// Fetch all Appointments
// Make sure new Appointment is not in 2nd list

export function testDeleteAppointment() {
  addAppointmentAPI();
}

function addAppointmentAPI() {
  addNewAppointmentTest(title, startTime, endTime, location, notes, untilType, frequencyType, timeBefore, type_Reminder)
    .then((res) => {
      if (res.status == 'error') {
        console.log(res);
        console.error(res.error);
      } else {
        //   console.log(res.data.id);
        fetchAppointmentsBeforeDelete(res.data.id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchAppointmentsBeforeDelete(id: string) {
  getAppointments('20', '03', '2023')
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        res.data.forEach((item, index) => {
          if (item.id == id) {
            deleteNewAppointment(item.id);
          }
        });
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function deleteNewAppointment(id: string) {
  deleteToDo(id)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        getAppointmentsAfterDelete(id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function getAppointmentsAfterDelete(id: string) {
  getAppointments('20', '03', '2023')
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
          console.log('delete appointment test failed');
        } else {
          console.log('delete appointment test passed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
