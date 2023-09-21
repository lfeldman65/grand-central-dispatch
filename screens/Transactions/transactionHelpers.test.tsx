import { removeTrailingDecimal, removeLeadingDecimal, roundToInt } from './transactionHelpers';
import { describe, expect, test } from '@jest/globals';

describe('remove trailing decimal 1', () => {
  test('remove trailing decimal 1', () => {
    var result = removeTrailingDecimal('3129.27');
    expect(result).toBe('3129');
  });
});

describe('remove trailing decimal 2', () => {
  test('remove trailing decimal 2', () => {
    var result = removeTrailingDecimal('3129');
    expect(result).toBe('3129');
  });
});

describe('remove trailing decimal 3', () => {
  test('remove trailing decimal 3', () => {
    var result = removeTrailingDecimal('');
    expect(result).toBe('');
  });
});

describe('remove leading decimal 1', () => {
  test('remove leading decimal 1', () => {
    var result = removeLeadingDecimal('3129.27');
    expect(result).toBe('27');
  });
});

describe('remove leading decimal 2', () => {
  test('remove leading decimal 2', () => {
    var result = removeLeadingDecimal('');
    expect(result).toBe('0');
  });
});

describe('round to int 1', () => {
  test('round to int 1', () => {
    var result = roundToInt('');
    expect(result).toBe('0');
  });
});

describe('round to int 2', () => {
  test('round to int 2', () => {
    var result = roundToInt('21');
    expect(result).toBe('21');
  });
});

describe('round to int 3', () => {
  test('round to int 3', () => {
    var result = roundToInt('21.45');
    expect(result).toBe('21');
  });
});

describe('round to int 4', () => {
  test('round to int 4', () => {
    var result = roundToInt('21.55');
    expect(result).toBe('22');
  });
});
