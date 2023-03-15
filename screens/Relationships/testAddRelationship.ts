import { addNewContact, getRelDetails } from './api';

const firstName = 'firstabc';
const lastName = 'lastabc';

export function testAddRelationship() {
  addRel();
}

function addRel() {
  addNewContact(firstName, lastName, 'Rel', 'company', '', '')
    .then((res) => {
      if (res.status == 'error') {
        console.log(res);
        console.error(res.error);
      } else {
        fetchDetails(res.data[0].id);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchDetails(guid: string) {
  getRelDetails(guid)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (res.data.firstName == firstName && res.data.lastName == lastName) {
          console.log('Add and read Relationship test passed');
        } else {
          console.log('Add and read Relationship test failed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
