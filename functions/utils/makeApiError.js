module.exports = function makeApiError(error, message, status = 400) {
  if (!error._safeMessage) {
    error._safeMessage = message;
  }

  if (!error._safeStatus) {
    error._safeStatus = status;
  }  

  return error;
}
