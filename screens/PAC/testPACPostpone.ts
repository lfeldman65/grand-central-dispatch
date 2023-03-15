import { getPACData } from './api';
import { completeAction, postponeAction } from './postponeAndComplete';

var contactGUID0 = '';
var contactGUID1 = '';

export function pacTestPostpone() {
  fetchPAC('calls');
}

function fetchPAC(type: string) {
  getPACData(type)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        contactGUID0 = res.data[0].contactId;
        contactGUID1 = res.data[1].contactId;
        postponeAction(contactGUID0, 'call', completeSuccess, completeFailure);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchPAC2(type: string) {
  getPACData(type)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (res.data[0].contactId == contactGUID1) {
          console.log('pac test postpone passed');
        } else {
          console.log('pac test postpone failed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function completeSuccess() {
  fetchPAC2('calls');
}

function completeFailure() {
  console.log('pac test failure');
}
