const { randomBytes } = require('crypto');

function respondWithSuccess(data, statusCode = 200, headers = {}) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  };
}

function respondWithEmptySuccess(headers = {}) {
  return {
    statusCode: 201,
    body: '',
    headers,
  };
}

function respondWithError(error) {
  const errorId = randomBytes(16).toString('hex');

  let statusCode = 500;
  let errorMessage = 'Leftfield is having some weird errors right now, but professional nerds have been dispatched!';

  if (error._safeStatus) {
    statusCode = error._safeStatus;
  }

  if (error._safeMessage) {
    errorMessage = error._safeMessage;
  }

  if (process.env.NETLIFY_DEV === 'true' && !!error.message) {
    errorMessage = JSON.stringify(error.message);
  }

  if ((process.env.NETLIFY_DEV === 'true' || statusCode >= 500) && error instanceof Error) {
    console.error(`[error start id="${errorId}"]\n${error.stack || error.message}\n[error end id="${errorId}"]`);
  }

  return respondWithSuccess({
    error: {
      message: errorMessage,
      id: errorId,
    }
  }, statusCode);
}

module.exports = {
  respondWithSuccess,
  respondWithEmptySuccess,
  respondWithError,
}
