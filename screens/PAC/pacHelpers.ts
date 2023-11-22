import { AddressProps } from './interfaces';

export function formatCityStateZip(address?: AddressProps) {
  var cityStateZip = '';
  if (address?.city != null && address?.city != '') {
    cityStateZip = address?.city! + ',';
  }
  if (address?.state != null && address?.state != '') {
    cityStateZip = cityStateZip + ' ' + address?.state;
  }
  if (address?.zip != null && address?.zip != '') {
    cityStateZip = cityStateZip + ' ' + address?.zip;
  }
  return cityStateZip;
}

export function completeAddress(address?: AddressProps) {
  var completeAddress = '';
  if (address?.street != null) {
    completeAddress = address?.street!;
  }
  if (address?.street2 != null) {
    completeAddress = completeAddress + ' ' + address?.street2!;
  }
  return completeAddress + ' ' + formatCityStateZip(address);
}
