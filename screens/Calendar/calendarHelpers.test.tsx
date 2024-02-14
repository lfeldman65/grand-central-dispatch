import {
  getDayNumber,
  getYear,
  convertReminderUnit,
  convertReminderTime,
  getMonthNumber,
  makeLongTxtPretty,
} from './calendarHelpers';
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

describe('convert reminder unit 1', () => {
  test('convert reminder unit 1', () => {
    var result = convertReminderUnit('');
    expect(result).toBe('None');
  });
});

describe('convert reminder unit 2', () => {
  test('convert reminder unit 2', () => {
    var result = convertReminderUnit('Minutes');
    expect(result).toBe('minutes');
  });
});

describe('convert reminder unit 3', () => {
  test('convert reminder unit 3', () => {
    var result = convertReminderUnit('Hours');
    expect(result).toBe('hours');
  });
});

describe('convert reminder unit 4', () => {
  test('convert reminder unit 4', () => {
    var result = convertReminderUnit('Days');
    expect(result).toBe('days');
  });
});

describe('convert reminder unit 5', () => {
  test('convert reminder unit 5', () => {
    var result = convertReminderUnit('Weeks');
    expect(result).toBe('weeks');
  });
});

describe('convert reminder unit 6', () => {
  test('convert reminder unit 6', () => {
    var result = convertReminderUnit('Hello');
    expect(result).toBe('None');
  });
});

describe('convert reminder time 1', () => {
  test('convert reminder time 1', () => {
    var result = convertReminderTime('');
    expect(result).toBe(0);
  });
});

describe('convert reminder time 2', () => {
  test('convert reminder time 2', () => {
    var result = convertReminderTime('23');
    expect(result).toBe(23);
  });
});

describe('get month number 1', () => {
  test('get month number 1', () => {
    var result = getMonthNumber('Mon Jan 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('01');
  });
});

describe('get month number 2', () => {
  test('get month number 2', () => {
    var result = getMonthNumber('Mon Feb 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('02');
  });
});

describe('get month number 3', () => {
  test('get month number 3', () => {
    var result = getMonthNumber('Mon Mar 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('03');
  });
});

describe('get month number 4', () => {
  test('get month number 4', () => {
    var result = getMonthNumber('Mon Apr 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('04');
  });
});

describe('get month number 5', () => {
  test('get month number 5', () => {
    var result = getMonthNumber('Mon May 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('05');
  });
});

describe('get month number 6', () => {
  test('get month number 6', () => {
    var result = getMonthNumber('Mon Jun 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('06');
  });
});

describe('get month number 7', () => {
  test('get month number 7', () => {
    var result = getMonthNumber('Mon Jul 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('07');
  });
});

describe('get month number 8', () => {
  test('get month number 8', () => {
    var result = getMonthNumber('Mon Aug 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('08');
  });
});

describe('get month number 9', () => {
  test('get month number 9', () => {
    var result = getMonthNumber('Mon Sep 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('09');
  });
});

describe('get month number 10', () => {
  test('get month number 10', () => {
    var result = getMonthNumber('Mon Oct 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('10');
  });
});

describe('get month number 11', () => {
  test('get month number 11', () => {
    var result = getMonthNumber('Mon Nov 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('11');
  });
});

describe('get month number 12', () => {
  test('get month number 12', () => {
    var result = getMonthNumber('Mon Decxyz 14 2022 12:00:00 GMT-0800');
    expect(result).toBe('12');
  });
});

describe('make long text pretty 1', () => {
  test('make long text pretty 1', () => {
    var result = makeLongTxtPretty('abcd', 3);
    expect(result).toBe('abc . . .');
  });
});

describe('make long text pretty 2', () => {
  test('make long text pretty 2', () => {
    var result = makeLongTxtPretty('abcd', 4);
    expect(result).toBe('abcd');
  });
});
