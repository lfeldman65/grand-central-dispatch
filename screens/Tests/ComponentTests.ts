import { convertYearlyWeekNumber, milesBetween } from '../PopBys/popByHelpers';
import { getDayNumber, getYear } from '../Calendar/calendarHelpers';
import { displayName, isFirstLetterAlpha } from '../Relationships/relationshipHelpers';
import { removeTrailingDecimal, removeLeadingDecimal, roundToInt } from '../Transactions/transactionHelpers';

export function runAllComponentTests() {
  convertYearlyWeekNumberTests();
  milesBetweenTests();
  getDayNumberTests();
  displayNameTests();
  isFirstLetterAlphaTests();
  removeTrailingDecimalTests();
  removeLeadingDecimalTests();
  roundToIntTests();
}

export function convertYearlyWeekNumberTests() {
  var result = convertYearlyWeekNumber('');
  var expectedResult = 0;
  if (result == expectedResult) {
    console.log('convert test1 passed');
  } else {
    console.log('convert test1 failed');
  }
  result = convertYearlyWeekNumber('1');
  expectedResult = 2;
  if (result == expectedResult) {
    console.log('convert test2 passed');
  } else {
    console.log('convert test2 failed');
  }
  result = convertYearlyWeekNumber('0');
  expectedResult = 2;
  if (result == expectedResult) {
    console.log('convert test3 passed');
  } else {
    console.log('convert test3 failed');
  }
}

export function milesBetweenTests() {
  var result = milesBetween(-117.53, 33.13, -118.67, 34.24);
  var expectedResult = 101;
  if (Math.round(result) == expectedResult) {
    console.log('miles test1 passed');
  } else {
    console.log('miles test1 failed');
  }
}

export function getDayNumberTests() {
  var result = getDayNumber('Mon Nov 14 2022 12:00:00 GMT-0800');
  var expectedResult = '14';
  if (result == expectedResult) {
    console.log('day number test1 passed');
  } else {
    console.log('day number test1 failed');
  }
  result = getDayNumber('Tues Oct 31 2022 12:00:00 GMT-0800');
  expectedResult = '31';
  if (result == expectedResult) {
    console.log('day number test2 passed');
  } else {
    console.log('day number test2 failed');
  }
  result = getYear('Tues Oct 31 2022 12:00:00 GMT-0800');
  expectedResult = '2022';
  if (result == expectedResult) {
    console.log('year test1 passed');
  } else {
    console.log('year test2 failed');
  }
}

export function displayNameTests() {
  var result = displayName('Larry', 'Feldman', 'Rel', 'Motorola', 'First Last');
  var expectedResult = 'Larry Feldman';
  if (result == expectedResult) {
    console.log('display name test1 passed');
  } else {
    console.log('display name test1 failed');
  }
  result = displayName('Larry', 'Feldman', 'Rel', 'Motorola', 'Last, First');
  expectedResult = 'Feldman, Larry';
  if (result == expectedResult) {
    console.log('display name test2 passed');
  } else {
    console.log('display name test2 failed');
  }
  result = displayName('Larry', 'Feldman', 'Biz', 'Motorola', 'Last, First');
  expectedResult = 'Motorola (Larry)';
  if (result == expectedResult) {
    console.log('display name test3 passed');
  } else {
    console.log('display name test3 failed');
  }
}

export function isFirstLetterAlphaTests() {
  var result = isFirstLetterAlpha('LarryFeldman');
  var expectedResult = true;
  if (result == expectedResult) {
    console.log('isFirstLetterAlpha test1 passed');
  } else {
    console.log('isFirstLetterAlpha test1 failed');
  }
  result = isFirstLetterAlpha('larryFeldman');
  expectedResult = true;
  if (result == expectedResult) {
    console.log('isFirstLetterAlpha test2 passed');
  } else {
    console.log('isFirstLetterAlpha test2 failed');
  }
  result = isFirstLetterAlpha('4arryFeldman');
  expectedResult = false;
  if (result == expectedResult) {
    console.log('isFirstLetterAlpha test3 passed');
  } else {
    console.log('isFirstLetterAlpha test3 failed');
  }
  result = isFirstLetterAlpha('!arryFeldman');
  expectedResult = false;
  if (result == expectedResult) {
    console.log('isFirstLetterAlpha test4 passed');
  } else {
    console.log('isFirstLetterAlpha test4 failed');
  }
}

export function removeTrailingDecimalTests() {
  var result = removeTrailingDecimal('3129.27');
  var expectedResult = '3129';
  if (result == expectedResult) {
    console.log('removeTrailingDecimal test1 passed');
  } else {
    console.log('removeTrailingDecimal test1 failed');
  }
  var result = removeTrailingDecimal('');
  var expectedResult = '';
  if (result == expectedResult) {
    console.log('removeTrailingDecimal test2 passed');
  } else {
    console.log('removeTrailingDecimal test2 failed');
  }
}

export function removeLeadingDecimalTests() {
  var result = removeLeadingDecimal('3129.27');
  var expectedResult = '27';
  if (result == expectedResult) {
    console.log('removeLeadingDecimal test1 passed');
  } else {
    console.log('removeLeadingDecimal test1 failed');
  }
  result = removeLeadingDecimal('');
  expectedResult = '0';
  if (result == expectedResult) {
    console.log('removeLeadingDecimal test2 passed');
  } else {
    console.log('removeLeadingDecimal test2 failed');
  }
}

export function roundToIntTests() {
  var result = roundToInt('');
  var expectedResult = '0';
  if (result == expectedResult) {
    console.log('roundToInt test1 passed');
  } else {
    console.log('roundToInt test1 failed');
  }
  result = roundToInt('21');
  expectedResult = '21';
  if (result == expectedResult) {
    console.log('roundToInt test2 passed');
  } else {
    console.log('roundToInt test2 failed');
  }
  result = roundToInt('21.45');
  expectedResult = '21';
  if (result == expectedResult) {
    console.log('roundToInt test3 passed');
  } else {
    console.log('roundToInt test3 failed');
  }
  result = roundToInt('21.55');
  expectedResult = '22';
  if (result == expectedResult) {
    console.log('roundToInt test4 passed');
  } else {
    console.log('roundToInt test4 failed');
  }
}
