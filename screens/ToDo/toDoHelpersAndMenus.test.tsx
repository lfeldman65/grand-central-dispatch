import { convertRecurrence } from './toDoHelpersAndMenus';
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
