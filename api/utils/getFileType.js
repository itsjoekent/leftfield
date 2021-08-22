const mime = require('mime');

module.exports = function getFileType(fileName) {
  if (!!fileName && fileName.endsWith('.br')) {
    return mime.getType(fileName.substring(0, fileName.length - 3));
  }

  return mime.getType(fileName);
}
