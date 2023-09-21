import { PopByRadiusDataProps, PopByAddress } from './interfaces';
import { milesBetween, convertYearlyWeekNumber, matchesSearch } from './popByHelpers';
import { describe, expect, test } from '@jest/globals';

describe('miles between', () => {
  // https://www.nhc.noaa.gov/gccalc.shtml
  test('checks miles between 2 sets of lat and long', () => {
    var mb = milesBetween(-117.2, 33.1, -118.3, 34.6);
    expect(Math.round(mb)).toBe(121);
  });
});

describe('convert yearly week number 1', () => {
  test('checks yearly week number 1', () => {
    var result = convertYearlyWeekNumber('');
    expect(result).toBe(0);
  });
});

describe('convert yearly week number 2', () => {
  test('checks yearly week number 2', () => {
    var result = convertYearlyWeekNumber('1');
    expect(result).toBe(2);
  });
});

describe('matches search 1', () => {
  var address: PopByAddress = {
    street: '1730 Valley Oak Way',
    street2: '',
    city: 'Oceanside',
    state: 'CA',
    zip: '92056',
    country: 'USA',
    isFavorite: 'false',
  };
  var person: PopByRadiusDataProps = {
    id: '',
    firstName: 'Larry',
    lastName: 'Feldman',
    email: '',
    phone: '',
    mobile: '',
    homePhone: '',
    officePhone: '',
    ranking: '',
    distance: '',
    address: address,
    location: { latitude: '34', longitude: '-117' },
    lastPopbyDate: '',
    notified: false,
  };
  test('matches search 1', () => {
    var result = matchesSearch(person, 'Larry');
    expect(result).toBe(true);
  });
});
