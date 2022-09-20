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
