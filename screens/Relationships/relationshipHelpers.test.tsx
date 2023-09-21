import { displayName, isFirstLetterAlpha } from './relationshipHelpers';
import { describe, expect, test } from '@jest/globals';

describe('display name 1', () => {
  test('display name 1', () => {
    var result = displayName('Larry', 'Feldman', 'Rel', 'Motorola', 'First Last');
    expect(result).toBe('Larry Feldman');
  });
});

describe('display name 2', () => {
  test('display name 2', () => {
    var result = displayName('Larry', 'Feldman', 'Rel', 'Motorola', 'Last, First');
    expect(result).toBe('Feldman, Larry');
  });
});

describe('display name 3', () => {
  test('display name 3', () => {
    var result = displayName('Larry', 'Feldman', 'Biz', 'Motorola', 'First Last');
    expect(result).toBe('Motorola (Larry)');
  });
});

describe('is First Letter Alpha 1', () => {
  test('is First Letter Alpha 1', () => {
    var result = isFirstLetterAlpha('LarryFeldman');
    expect(result).toBe(true);
  });
});

describe('is First Letter Alpha 2', () => {
  test('is First Letter Alpha 2', () => {
    var result = isFirstLetterAlpha('4arryFeldman');
    expect(result).toBe(false);
  });
});
