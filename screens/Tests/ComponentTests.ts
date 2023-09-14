import { convertYearlyWeekNumber, milesBetween } from '../PopBys/popByHelpers';

export function runAllComponentTests() {
  convertYearlyWeekNumberTests();
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
}
