import { removeGroupMember, getGroupMembers } from './api';

export function testRemoveRelationshipFromGroup() {
  const groupID = '1697997'; // Advocates
  fetchGroupMembers(groupID);
}

function fetchGroupMembers(groupID: string) {
  getGroupMembers(groupID)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        if (res.data.length > 0) {
          console.log(res.data[0].id);
          removeRelFromGroup(groupID, res.data[0].id);
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function removeRelFromGroup(groupID: string, guid: string) {
  removeGroupMember(groupID, guid)
    .then((res) => {
      if (res.status == 'error') {
        console.error(res.error);
      } else {
        fetchGroupMembers2(groupID, guid);
      }
    })
    .catch((error) => console.error('failure ' + error));
}

function fetchGroupMembers2(groupID: string, guid: string) {
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
        });
        if (match) {
          console.log('Remove Rel from Group test failed');
        } else {
          console.log('Remove Rel from Group test passed');
        }
      }
    })
    .catch((error) => console.error('failure ' + error));
}
