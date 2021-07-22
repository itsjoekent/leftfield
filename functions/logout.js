const { handleLogout } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithEmptySuccess, respondWithError } = require('./utils/responder');

async function logout(event, context) {
  try {
    return handleLogout();
  } catch (error) {
    return respondWithError(makeApiError(error, 'Failed to logout, try again?'));
  }
}

exports.handler = logout;
