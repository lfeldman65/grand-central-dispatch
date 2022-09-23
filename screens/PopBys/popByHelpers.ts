import { PopByRadiusDataProps } from './interfaces';

export function convertYearlyWeekNumber(element: string) {
  if (element == null) {
    return 0;
  }
  if (element == '') {
    return 0;
  }
  return 2;
}

export function matchesSearch(person: PopByRadiusDataProps, search?: string) {
  if (search == null || search == '') {
    return true;
  }
  var searchLower = search.toLowerCase();
  if (searchLower == '') {
    return true;
  }
  if (person.firstName != null && person.firstName.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.lastName != null && person.lastName.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.street.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.street2.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.city.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.state.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.zip.toLowerCase().includes(searchLower)) {
    return true;
  }
  if (person.address != null && person.address.country.toLowerCase().includes(searchLower)) {
    return true;
  }
  return false;
}

// public static double MilesBetween(double lon1, double lat1, double lon2, double lat2)
// {
//     var d1 = lat1 * (Math.PI / 180.0);
//     var num1 = lon1 * (Math.PI / 180.0);
//     var d2 = lat2 * (Math.PI / 180.0);
//     var num2 = lon2 * (Math.PI / 180.0) - num1;
//     var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) + Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);
//     return 3962.16 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)));
// }

export function milesBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  console.log('lon1: ' + lon1);
  var lat1Radians = lat1 * (Math.PI / 180.0);
  var lon1Radians = lon1 * (Math.PI / 180.0);
  var lat2Radians = lat2 * (Math.PI / 180.0);
  var lon2RadiansAdj = lon2 * (Math.PI / 180.0) - lon1Radians;
  var result1 =
    Math.pow(Math.sin((lat2Radians - lat1Radians) / 2.0), 2) +
    Math.cos(lat1Radians) * Math.pow(Math.sin(lon2RadiansAdj / 2.0), 2);
  return 3962.16 * (2.0 * Math.atan2(Math.sqrt(result1), Math.sqrt(1.0 - result1)));
}
