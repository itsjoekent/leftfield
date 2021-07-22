module.exports = function makeApiError(error, message, status = 400) {
  error._safeMessage = message;
  error._safeStatus = status;

  return error;
}
