const Account = require('./db/Account');
const { handleLogin } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithEmptySuccess, respondWithError } = require('./utils/responder');

async function login(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');
    const { email, password } = data;

    if (!email) {
      throw makeApiError(new Error(), 'Missing email', 400);
    }

    if (!password) {
      throw makeApiError(new Error(), 'Missing password', 400);
    }

    const accountQuery = await Account.query('email').eq('test').using('emailIndex').exec();

    if (!accountQuery.count) {
      throw makeApiError(new Error(), 'Incorrect email or password', 400);
    }

    const [account] = accountQuery;
    console.log(account)
    return respondWithEmptySuccess();
  } catch (error) {
    return respondWithError(makeApiError(error, 'Failed to login, try again?'));
  }
}

exports.handler = login;
