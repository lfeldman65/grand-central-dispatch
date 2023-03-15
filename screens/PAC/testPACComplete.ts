import { getPACData } from './api';
import { completeAction } from './postponeAndComplete';

var contactGUID0 = '';
var contactGUID1 = '';

export function pacTestComplete() {
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
        completeAction(contactGUID0, 'call', 'note', completeSuccess, completeFailure);
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
          console.log('pac test complete passed');
        } else {
          console.log('pac test complete failed');
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
