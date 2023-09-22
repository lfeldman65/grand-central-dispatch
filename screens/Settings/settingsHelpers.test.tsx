import { percentToDecimal, decimalToPercent } from './settingsHelpers';
import { describe, expect, test } from '@jest/globals';

describe('percent to decimal 1', () => {
  test('percent to dec 1', () => {
    var result = percentToDecimal('30');
    expect(result).toBe('0.3');
  });
});

describe('percent to decimal 2', () => {
  test('percent to decimal 2', () => {
    var result = percentToDecimal('3');
    expect(result).toBe('0.03');
  });
});

describe('percent to decimal 3', () => {
  test('percent to decimal 3', () => {
    var result = percentToDecimal('');
    expect(result).toBe('');
  });
});

describe('decimal to percent 1', () => {
  test('decimal to percent 1', () => {
    var result = decimalToPercent('.40');
    expect(result).toBe('40');
  });
});

describe('decimal to percent 2', () => {
  test('decimal to percent 2', () => {
    var result = decimalToPercent('.04');
    expect(result).toBe('4');
  });
});

describe('decimal to percent 3', () => {
  test('decimal to percent 3', () => {
    var result = decimalToPercent('');
    expect(result).toBe('');
  });
});
