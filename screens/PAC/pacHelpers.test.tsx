import { AddressProps } from './interfaces';
import { formatCityStateZip } from './pacHelpers';
import { describe, expect, test } from '@jest/globals';

describe('format pac city, state, zip', () => {
  var thisAddress: AddressProps = {
    street: '577 W. Bobier Drive',
    street2: 'Apt 202',
    city: 'Vista',
    state: 'CA',
    zip: '92056',
    country: 'USA',
    isFavorite: 'true',
  };
  test('format pac city, state, zip', () => {
    var result = formatCityStateZip(thisAddress);
    expect(result).toBe('Vista, CA 92056');
  });
});

describe('format pac city, state, zip 2', () => {
  var thisAddress: AddressProps = {
    street: '577 W. Bobier Drive',
    street2: 'Apt 202',
    city: '',
    state: 'CA',
    zip: '92056',
    country: 'USA',
    isFavorite: 'true',
  };
  test('format pac city, state, zip 2', () => {
    var result = formatCityStateZip(thisAddress);
    expect(result).toBe(' CA 92056');
  });
});

describe('format pac city, state, zip 2', () => {
  var thisAddress: AddressProps = {
    street: '577 W. Bobier Drive',
    street2: 'Apt 202',
    city: 'Vista',
    state: '',
    zip: '92056',
    country: 'USA',
    isFavorite: 'true',
  };
  test('format pac city, state, zip 2', () => {
    var result = formatCityStateZip(thisAddress);
    expect(result).toBe('Vista, 92056');
  });
});

describe('format pac city, state, zip 3', () => {
  var thisAddress: AddressProps = {
    street: '577 W. Bobier Drive',
    street2: 'Apt 202',
    city: 'Vista',
    state: 'CA',
    zip: '',
    country: 'USA',
    isFavorite: 'true',
  };
  test('format pac city, state, zip 3', () => {
    var result = formatCityStateZip(thisAddress);
    expect(result).toBe('Vista, CA');
  });
});

describe('format pac city, state, zip 4', () => {
  var thisAddress: AddressProps = {
    street: '577 W. Bobier Drive',
    street2: 'Apt 202',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    isFavorite: 'true',
  };
  test('format pac city, state, zip 4', () => {
    var result = formatCityStateZip(thisAddress);
    expect(result).toBe('');
  });
});
