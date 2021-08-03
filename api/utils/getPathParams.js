module.exports = function getPathParams(event) {
  const [, ...params] = event.path.replace('/.netlify/functions/', '').split('/');
  return params;
}
