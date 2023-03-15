import { addRelToGroup, getGroupMembers } from './api';

export function testAddRelationshipToGroup() {
  const guid = 'b6355526-fdf0-40f6-8e0b-fecbb8977fde'; // !Andrew AndrewLast
  const groupID = '1697997'; // Advocates
  addRelToGroup1(guid, groupID);
}

function addRelToGroup1(guid: string, groupID: string) {
  addRelToGroup(groupID, guid)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        console.log('group id: ' + groupID);
        fetchGroupMembers(guid, groupID);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchGroupMembers(guid: string, groupID: string) {
  var match = false;
  getGroupMembers(groupID)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        res.data.forEach((item, index) => {
          console.log(item.id);
          if (item.id == guid) {
            match = true;
          }
          if (match) {
            console.log('Add Rel to Group test passed');
          } else {
            console.log('Add Rel to Group test fail');
          }
        });
      }
    })
    .catch((error) => console.error('failure ' + error));
}
