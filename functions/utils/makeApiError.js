module.exports = function makeApiError({
  error = {},
  message = 'Server error',
  status = 400
}) {
  error._apiError = true;

  if (!error._safeMessage) {
    error._safeMessage = message;
  }

  if (!error._safeStatus) {
    error._safeStatus = status;
  }

  return error;
}
