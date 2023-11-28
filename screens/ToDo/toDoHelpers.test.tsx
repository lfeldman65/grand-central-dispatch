import { convertRecurrence, convertFrequency, convertReminder, convertOrder } from './toDoHelpers';
import { describe, expect, test } from '@jest/globals';

describe('to-do recurrence 1', () => {
  test('to-do recurrence 1', () => {
    var result = convertRecurrence('Never');
    expect(result).toBe('never');
  });
});

describe('to-do recurrence 2', () => {
  test('to-do recurrence 2', () => {
    var result = convertRecurrence('Daily');
    expect(result).toBe('daily');
  });
});

describe('to-do recurrence 3', () => {
  test('to-do recurrence 3', () => {
    var result = convertRecurrence('Everyday M-F');
    expect(result).toBe('everyweekday');
  });
});

describe('to-do recurrence 4', () => {
  test('to-do recurrence 4', () => {
    var result = convertRecurrence('Weekly on');
    expect(result).toBe('weeklyon');
  });
});

describe('to-do recurrence 5', () => {
  test('to-do recurrence 5', () => {
    var result = convertRecurrence('Monthly on the');
    expect(result).toBe('monthlyon');
  });
});

describe('to-do recurrence 6', () => {
  test('to-do recurrence 6', () => {
    var result = convertRecurrence('Every _ week of the month');
    expect(result).toBe('everyxweekofmonth');
  });
});

describe('to-do recurrence 7', () => {
  test('to-do recurrence 7', () => {
    var result = convertRecurrence('Yearly');
    expect(result).toBe('yearlyon');
  });
});

describe('to-do recurrence 8', () => {
  test('to-do recurrence 8', () => {
    var result = convertRecurrence('');
    expect(result).toBe('never');
  });
});

describe('to-do recurrence 9', () => {
  test('to-do recurrence 9', () => {
    var result = convertRecurrence('198$3');
    expect(result).toBe('never');
  });
});

describe('to-do frequency 1', () => {
  test('to-do frequency 1', () => {
    var result = convertFrequency('');
    expect(result).toBe(0);
  });
});

describe('to-do frequency 2', () => {
  test('to-do frequency 2', () => {
    var result = convertFrequency('None');
    expect(result).toBe(0);
  });
});

describe('to-do frequency 3', () => {
  test('to-do frequency 3', () => {
    var result = convertFrequency('Every Week');
    expect(result).toBe(1);
  });
});

describe('to-do frequency 4', () => {
  test('to-do frequency 4', () => {
    var result = convertFrequency('Every Month');
    expect(result).toBe(1);
  });
});

describe('to-do frequency 5', () => {
  test('to-do frequency 5', () => {
    var result = convertFrequency('Every Year');
    expect(result).toBe(1);
  });
});

describe('to-do frequency 6', () => {
  test('to-do frequency 6', () => {
    var result = convertFrequency('Every 2 Weeks');
    expect(result).toBe(2);
  });
});

describe('to-do frequency 7', () => {
  test('to-do frequency 7', () => {
    var result = convertFrequency('Every 2 Months');
    expect(result).toBe(2);
  });
});

describe('to-do frequency 8', () => {
  test('to-do frequency 8', () => {
    var result = convertFrequency('Every 2 Years');
    expect(result).toBe(2);
  });
});

describe('to-do frequency 9', () => {
  test('to-do frequency 9', () => {
    var result = convertFrequency('3 Days Long !');
    expect(result).toBe(3);
  });
});

describe('to-do frequency 10', () => {
  test('to-do frequency 10', () => {
    var result = convertFrequency('4 Days Long !');
    expect(result).toBe(4);
  });
});

describe('to-do frequency 11', () => {
  test('to-do frequency 11', () => {
    var result = convertFrequency('5 Days Long !');
    expect(result).toBe(5);
  });
});

describe('to-do frequency 12', () => {
  test('to-do frequency 12', () => {
    var result = convertFrequency('6 Days Long !');
    expect(result).toBe(6);
  });
});

describe('to-do frequency 13', () => {
  test('to-do frequency 13', () => {
    var result = convertFrequency('7 Days Long !');
    expect(result).toBe(7);
  });
});

describe('to-do frequency 14', () => {
  test('to-do frequency 14', () => {
    var result = convertFrequency('8 Days Long !');
    expect(result).toBe(8);
  });
});

describe('to-do frequency 15', () => {
  test('to-do frequency 15', () => {
    var result = convertFrequency('12 Days Long !');
    expect(result).toBe(12);
  });
});

describe('to-do frequency 16', () => {
  test('to-do frequency 16', () => {
    var result = convertFrequency('x Days Long !');
    expect(result).toBe(0);
  });
});

describe('reminder 1', () => {
  test('reminder 1', () => {
    var result = convertReminder('');
    expect(result).toBe(0);
  });
});

describe('reminder 2', () => {
  test('reminder 2', () => {
    var result = convertReminder('None');
    expect(result).toBe(0);
  });
});

describe('reminder 3', () => {
  test('reminder 3', () => {
    var result = convertReminder('1 blah');
    expect(result).toBe(1);
  });
});

describe('reminder 4', () => {
  test('reminder 4', () => {
    var result = convertReminder('2 blah');
    expect(result).toBe(2);
  });
});

describe('reminder 5', () => {
  test('reminder 5', () => {
    var result = convertReminder('3 blah');
    expect(result).toBe(3);
  });
});

describe('reminder 6', () => {
  test('reminder 6', () => {
    var result = convertReminder('4 blah');
    expect(result).toBe(4);
  });
});

describe('reminder 7', () => {
  test('reminder 7', () => {
    var result = convertReminder('5 blah');
    expect(result).toBe(5);
  });
});

describe('reminder 8', () => {
  test('reminder 8', () => {
    var result = convertReminder('6 blah');
    expect(result).toBe(6);
  });
});

describe('reminder 9', () => {
  test('reminder 9', () => {
    var result = convertReminder('blah');
    expect(result).toBe(7);
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
