export function getLine1(title: string) {
  if (title == '') {
    return '';
  }
  if (title.includes(':')) {
    var titleParts = title.split(':');
    return titleParts[0] + ':' + titleParts[1];
  }
  return '';
}

export function getLine2(title: string) {
  if (title == '') {
    return '';
  }
  if (title.includes(':')) {
    var titleParts = title.split(':');
    if (titleParts.length > 2) {
      return titleParts[2].trim();
    }
    return '';
  }
  return '';
}

export function makeTimePretty(duration: number) {
  if (duration == undefined) {
    return 0;
  }
  var hrs = 0;
  var hrsFloor = 0;
  var min = 0;
  var minFloor = 0;
  var sec = 0;

  hrs = duration / 3600;
  hrsFloor = Math.floor(hrs);
  duration = duration - hrsFloor * 3600;
  min = duration / 60;
  minFloor = Math.floor(min);
  duration = duration - minFloor * 60;
  sec = duration;

  return (
    pad0IfNeeded(hrsFloor.toString()) + ':' + pad0IfNeeded(minFloor.toString()) + ':' + pad0IfNeeded(sec.toString())
  );
}

export function pad0IfNeeded(part: string) {
  if (part.length < 2) {
    return '0' + part;
  }
  return part;
}
