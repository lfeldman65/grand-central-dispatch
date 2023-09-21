import { displayName, titleFor } from './goalHelpers';
import { describe, expect, test } from '@jest/globals';
import { GoalObject } from './interfaces';

describe('display name select rel 1', () => {
  test('display name select rel 1', () => {
    var result = displayName('Larry', 'Feldman', 'Rel', 'Motorola', false);
    expect(result).toBe('Larry Feldman');
  });
});

describe('display name select rel 2', () => {
  test('display name select rel 2', () => {
    var result = displayName('Larry', 'Feldman', 'Biz', 'Motorola', false);
    expect(result).toBe('Motorola (Larry)');
  });
});

describe('goal title 1', () => {
  var myGoal: GoalObject = {
    id: 1,
    title: '',
    custom: false,
    weeklyTarget: 4,
    displayOnDashboard: true,
  };
  test('goal title 1', () => {
    var result = titleFor(myGoal);
    expect(result).toBe('');
  });
});

describe('goal title 2', () => {
  var myGoal: GoalObject = {
    id: 1,
    title: 'Pop-By Made',
    custom: false,
    weeklyTarget: 4,
    displayOnDashboard: true,
  };
  test('goal title 2', () => {
    var result = titleFor(myGoal);
    expect(result).toBe('Pop-Bys Delivered');
  });
});

describe('goal title 2', () => {
  var myGoal: GoalObject = {
    id: 1,
    title: 'New Contacts',
    custom: false,
    weeklyTarget: 4,
    displayOnDashboard: true,
  };
  test('goal title 2', () => {
    var result = titleFor(myGoal);
    expect(result).toBe('Database Additions');
  });
});

describe('goal title 3', () => {
  var myGoal: GoalObject = {
    id: 1,
    title: 'Notes Made',
    custom: false,
    weeklyTarget: 4,
    displayOnDashboard: true,
  };
  test('goal title 3', () => {
    var result = titleFor(myGoal);
    expect(result).toBe('Notes Written');
  });
});

describe('goal title 4', () => {
  var myGoal: GoalObject = {
    id: 1,
    title: 'Blah',
    custom: false,
    weeklyTarget: 4,
    displayOnDashboard: true,
  };
  test('goal title 4', () => {
    var result = titleFor(myGoal);
    expect(result).toBe('Blah');
  });
});
