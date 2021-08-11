module.exports = function isTrueString(input) {
  return typeof input === 'string' ? input.toLowerCase() === 'true' : false;
}
