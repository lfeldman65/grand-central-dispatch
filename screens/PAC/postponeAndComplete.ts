import { postponePAC, completePAC } from './api';

export function postponeAction(contactId: string, type: string, onSuccess: any, onFailure: any) {
  postponePAC(contactId, type)
    .then((res) => {
      console.log(res);
      if (res.status == 'error') {
        console.error(res.error);
        onFailure();
      } else {
        onSuccess();
      }
    })
    .catch((error) => {
      onFailure();
      console.log('postpone error' + error);
    });
}

export function completeAction(contactId: string, type: string, note: string, onSuccess: any, onFailure: any) {
  completePAC(contactId, type, note)
    .then((res) => {
      console.log(res);
      if (res.status == 'error') {
        console.error(res.error);
        onFailure();
      } else {
        onSuccess();
      }
    })
    .catch((error) => {
      onFailure();
      console.log('complete error' + error);
    });
}
