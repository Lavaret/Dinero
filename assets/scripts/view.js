//creates checksum
function hashCode(str) {
  var checksum = str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
  if(checksum < 0) {
    checksum = '0'+Math.abs(checksum);
  }

  return String(checksum) ? checksum : toString(checksum);
}