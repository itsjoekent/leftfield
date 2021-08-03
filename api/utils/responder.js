const { randomBytes } = require('crypto');

function respondWithSuccess(response, data, statusCode = 200, headers = {}) {
  response.set(headers);
  response.status(statusCode).json(data);
}

function respondWithEmptySuccess(response, headers = {}) {
  response.set(headers);
  response.send('');
  response.status(201).end();
}

function respondWithError(response, error) {
  const errorId = randomBytes(16).toString('hex');

  let statusCode = 500;
  let errorMessage = 'Leftfield is having some weird errors right now, but professional nerds have been dispatched!';

  if (error._safeStatus) {
    statusCode = error._safeStatus;
  }

  if (error._safeMessage) {
    errorMessage = error._safeMessage;
  }

  if (process.env.NODE_ENV === 'development' && !!error.message) {
    errorMessage = JSON.stringify(error.message);
  }

  if ((process.env.NODE_ENV === 'development' || statusCode >= 500) && error instanceof Error) {
    console.error(`[error start id="${errorId}"]\n${error.stack || error.message}\n[error end id="${errorId}"]`);
  }

  response.status(statusCode).json({
    error: {
      message: errorMessage,
      id: errorId,
    },
  });
}

module.exports = {
  respondWithSuccess,
  respondWithEmptySuccess,
  respondWithError,
}
