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
  if (person.firstName != null && person.lastName != null) {
    var firstLast = person.firstName.toLowerCase() + ' ' + person.lastName.toLowerCase();
    if (firstLast.toLowerCase().includes(searchLower)) {
      return true;
    }
  }
  return false;
}

export function shortestRoute(data: PopByRadiusDataProps[]) {
  console.log('DATALENGTH: ' + data.length);
  var i = 0;
  var j = 0;
  var optimalRoute = '';
  var sTSP = 0;
  var vertex = new Array();
  var bestRoute = new Array();
  var minPath = 999999;
  var currentCost = 0;
  var numNodes = data.length;
  if (data.length > 10) {
    numNodes = 10;
  }
  var graph: number[][] = [];
  for (var i = 0; i < numNodes; i++) {
    graph[i] = [];
    for (var j = 0; j < numNodes; j++) {
      graph[i][j] = milesBetween(
        parseFloat(data[i].location.longitude),
        parseFloat(data[i].location.latitude),
        parseFloat(data[j].location.longitude),
        parseFloat(data[j].location.latitude)
      );
    }
  }
  // console.log(graph);
  for (var i = 0; i < numNodes; i++) {
    if (i != sTSP) {
      vertex.push(i);
    }
  }
  while (nextPerm(vertex)) {
    var currentCost = 0;
    var k = sTSP;
    for (var i = 0; i < vertex.length; i++) {
      currentCost = currentCost + graph[k][vertex[i]];
      k = vertex[i];
    }
    currentCost = currentCost + graph[k][sTSP];
    if (currentCost < minPath) {
      minPath = currentCost;
      bestRoute = [];
      optimalRoute = '0 -> ';
      for (var j = 0; j < vertex.length; j++) {
        bestRoute.push(vertex[j]);
        optimalRoute = optimalRoute + vertex[j].toString() + ' -> ';
      }
    }
  }
  optimalRoute = optimalRoute + '0';
  console.log('optimal route: ' + optimalRoute);
  console.log('min path: ' + minPath);
  return bestRoute;
}

export function milesBetween(lon1: number, lat1: number, lon2: number, lat2: number) {
  try {
    var d1 = lat1 * (Math.PI / 180.0);
    var num1 = lon1 * (Math.PI / 180.0);
    var d2 = lat2 * (Math.PI / 180.0);
    var num2 = lon2 * (Math.PI / 180.0) - num1;
    var d3 = Math.pow(Math.sin((d2 - d1) / 2.0), 2) + Math.cos(d1) * Math.cos(d2) * Math.pow(Math.sin(num2 / 2.0), 2);
    return 3962.16 * (2.0 * Math.atan2(Math.sqrt(d3), Math.sqrt(1.0 - d3)));
  } catch {
    return 0;
  }
}

function nextPerm(array: number[]) {
  var n = array.length;
  var i = n - 2;
  while (i >= 0 && array[i] > array[i + 1]) {
    i = i - 1;
  }
  if (i == -1) {
    return false;
  }
  var j = i + 1;
  while (j < n && array[j] > array[i]) {
    j = j + 1;
  }
  j = j - 1;
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  var left = i + 1;
  var right = n - 1;

  while (left < right) {
    var temp2 = array[left];
    array[left] = array[right];
    array[right] = temp2;
    left = left + 1;
    right = right - 1;
  }
  return true;
}
