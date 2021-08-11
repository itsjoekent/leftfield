module.exports = function isLengthyString(input) {
  return typeof input === 'string' && !!input.length;
}
