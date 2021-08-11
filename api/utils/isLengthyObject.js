module.exports = function isLengthyString(input) {
  return typeof input === 'object' && !!Object.keys(input).length;
}
