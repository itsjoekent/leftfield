const { handleLogin } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithEmptySuccess, respondWithError } = require('./utils/responder');

async function login(event, context) {
  try {
    return await handleLogin(event);
  } catch (error) {
    return respondWithError(makeApiError(error, 'Failed to login, try again?'));
  }
}

exports.handler = login;
