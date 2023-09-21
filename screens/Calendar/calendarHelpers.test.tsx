import { getDayNumber, getYear } from './calendarHelpers';
import { describe, expect, test } from '@jest/globals';

describe('checks day number 1', () => {
  test('checks day number 1', () => {
    var result = getDayNumber('Mon Nov 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('14');
  });
});

describe('checks day number 2', () => {
  test('checks day number 2', () => {
    var result = getDayNumber('Tues Oct 31 2022 12:00:00 GMT-0800');
    expect(result).toBe('31');
  });
});

describe('checks year 1', () => {
  test('checks day number 2', () => {
    var result = getYear('Tues Oct 31 2022 12:00:00 GMT-0800');
    expect(result).toBe('2022');
  });
});
