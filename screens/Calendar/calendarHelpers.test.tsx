import {
  getDayNumber,
  getYear,
  convertRecurrence,
  convertFrequency,
  convertReminderUnit,
  convertOrder,
  convertReminderTime,
  getMonthNumber,
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

describe('calendar recurrence 1', () => {
  test('calendar recurrence 1', () => {
    var result = convertRecurrence('Never');
    expect(result).toBe('never');
  });
});

describe('calendar recurrence 2', () => {
  test('calendar recurrence 2', () => {
    var result = convertRecurrence('Daily');
    expect(result).toBe('daily');
  });
});

describe('calendar recurrence 3', () => {
  test('calendar recurrence 3', () => {
    var result = convertRecurrence('Everyday M-F');
    expect(result).toBe('everyweekday');
  });
});

describe('calendar recurrence 4', () => {
  test('calendar recurrence 4', () => {
    var result = convertRecurrence('Weekly on');
    expect(result).toBe('weeklyon');
  });
});

describe('calendar recurrence 5', () => {
  test('calendar recurrence 5', () => {
    var result = convertRecurrence('Monthly on the');
    expect(result).toBe('monthlyon');
  });
});

describe('calendar recurrence 6', () => {
  test('calendar recurrence 6', () => {
    var result = convertRecurrence('Every _ week of the month');
    expect(result).toBe('everyxweekofmonth');
  });
});

describe('calendar recurrence 7', () => {
  test('calendar recurrence 7', () => {
    var result = convertRecurrence('Yearly');
    expect(result).toBe('yearlyon');
  });
});

describe('calendar recurrence 8', () => {
  test('calendar recurrence 8', () => {
    var result = convertRecurrence('');
    expect(result).toBe('never');
  });
});

describe('calendar recurrence 9', () => {
  test('calendar recurrence 9', () => {
    var result = convertRecurrence('198$3');
    expect(result).toBe('never');
  });
});

describe('calendar frequency 1', () => {
  test('calendar frequency 1', () => {
    var result = convertFrequency('');
    expect(result).toBe(0);
  });
});

describe('calendar frequency 2', () => {
  test('calendar frequency 2', () => {
    var result = convertFrequency('None');
    expect(result).toBe(0);
  });
});

describe('calendar frequency 3', () => {
  test('calendar frequency 3', () => {
    var result = convertFrequency('Every Week');
    expect(result).toBe(1);
  });
});

describe('calendar frequency 4', () => {
  test('calendar frequency 4', () => {
    var result = convertFrequency('Every Month');
    expect(result).toBe(1);
  });
});

describe('calendar frequency 5', () => {
  test('calendar frequency 5', () => {
    var result = convertFrequency('Every Year');
    expect(result).toBe(1);
  });
});

describe('calendar frequency 6', () => {
  test('calendar frequency 6', () => {
    var result = convertFrequency('Every 2 Weeks');
    expect(result).toBe(2);
  });
});

describe('calendar frequency 7', () => {
  test('calendar frequency 7', () => {
    var result = convertFrequency('Every 2 Months');
    expect(result).toBe(2);
  });
});

describe('calendar frequency 8', () => {
  test('calendar frequency 8', () => {
    var result = convertFrequency('Every 2 Years');
    expect(result).toBe(2);
  });
});

describe('calendar frequency 9', () => {
  test('calendar frequency 9', () => {
    var result = convertFrequency('3 Days Long !');
    expect(result).toBe(3);
  });
});

describe('calendar frequency 10', () => {
  test('calendar frequency 10', () => {
    var result = convertFrequency('4 Days Long !');
    expect(result).toBe(4);
  });
});

describe('calendar frequency 11', () => {
  test('calendar frequency 11', () => {
    var result = convertFrequency('5 Days Long !');
    expect(result).toBe(5);
  });
});

describe('calendar frequency 12', () => {
  test('calendar frequency 12', () => {
    var result = convertFrequency('6 Days Long !');
    expect(result).toBe(6);
  });
});

describe('calendar frequency 13', () => {
  test('calendar frequency 13', () => {
    var result = convertFrequency('7 Days Long !');
    expect(result).toBe(7);
  });
});

describe('calendar frequency 14', () => {
  test('calendar frequency 14', () => {
    var result = convertFrequency('8 Days Long !');
    expect(result).toBe(8);
  });
});

describe('calendar frequency 15', () => {
  test('calendar frequency 15', () => {
    var result = convertFrequency('12 Days Long !');
    expect(result).toBe(12);
  });
});

describe('calendar frequency 16', () => {
  test('calendar frequency 16', () => {
    var result = convertFrequency('x Days Long !');
    expect(result).toBe(0);
  });
});

describe('order 1', () => {
  test('order 1', () => {
    var result = convertOrder('');
    expect(result).toBe(0);
  });
});

describe('order 2', () => {
  test('order 2', () => {
    var result = convertOrder('First');
    expect(result).toBe(1);
  });
});

describe('order 3', () => {
  test('order 3', () => {
    var result = convertOrder('Second');
    expect(result).toBe(2);
  });
});

describe('order 4', () => {
  test('order 4', () => {
    var result = convertOrder('Third');
    expect(result).toBe(3);
  });
});

describe('order 5', () => {
  test('order 5', () => {
    var result = convertOrder('Fourth');
    expect(result).toBe(4);
  });
});

describe('order 6', () => {
  test('order 6', () => {
    var result = convertOrder('Last');
    expect(result).toBe(5);
  });
});

describe('order 7', () => {
  test('order 7', () => {
    var result = convertOrder('Hello');
    expect(result).toBe(0);
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
