import { getLine1, getLine2, makeTimePretty } from './podcastHelpers';
import { describe, expect, test } from '@jest/globals';

describe('get first line 1', () => {
  test('get first line 1', () => {
    var result = getLine1("It's a good life: S2E140: How I Sell");
    expect(result).toBe("It's a good life: S2E140");
  });
});

describe('get first line 2', () => {
  test('get first line 2', () => {
    var result = getLine1("It's a good life S2E140 How I Sell");
    expect(result).toBe('');
  });
});

describe('get second line 1', () => {
  test('get second line 1', () => {
    var result = getLine2("It's a good life: S2E140: How I Sell");
    expect(result).toBe('How I Sell');
  });
});

describe('get second line 2', () => {
  test('get second line 2', () => {
    var result = getLine2("It's a good life S2E140 How I Sell");
    expect(result).toBe('');
  });
});

describe('get second line 3', () => {
  test('get second line 3', () => {
    var result = getLine2("It's a good life: S2E140 How I Sell");
    expect(result).toBe('');
  });
});

describe('pretty time 1', () => {
  test('pretty time 1', () => {
    var result = makeTimePretty(1451);
    expect(result).toBe('00:24:11');
  });
});

describe('pretty time 2', () => {
  test('pretty time 2', () => {
    var result = makeTimePretty(4155);
    expect(result).toBe('01:09:15');
  });
});
