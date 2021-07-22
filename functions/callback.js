const { handleCallback } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithEmptySuccess, respondWithError } = require('./utils/responder');

async function callback(event, context) {
  try {
    return await handleCallback(event);
  } catch (error) {
    return respondWithError(makeApiError(error, 'Failed to login, try again?'));
  }
}

exports.handler = callback;
