import { GoalObject } from './interfaces';
export function displayName(first: string, last: string, type: string, employer: string, isAZ: boolean) {
  if (type == 'Rel') {
    return first + ' ' + last;
  }
  return employer + ' (' + first + ')';
}

export function titleFor(goal: GoalObject) {
  if (goal == null) {
    return '';
  }
  if (goal.title == null) {
    return '';
  }
  var oldTitle = goal.title;
  if (oldTitle == 'Pop-By Made') {
    return 'Pop-Bys Delivered';
  }
  if (oldTitle == 'New Contacts') {
    return 'Database Additions';
  }
  if (oldTitle == 'Notes Made') {
    return 'Notes Written';
  }
  return oldTitle;
}

export const referralMenu = [
  'Client gave me referral',
  'Client was referred to me',
  'I gave client a referral',
  'Cancel',
];
