const cookie = require('cookie');
const ms = require('ms');
const Account = require('./db/Account');
const { passwordCompare, signToken, AUTH_TOKEN_COOKIE } = require('./utils/auth');
const basicValidator = require('./utils/basicValidator');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');

async function login(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');

    await basicValidator(data, [
      { key: 'email', humanName: 'email' },
      { key: 'password', humanName: 'password' },
    ]);

    const { email, password } = data;

    const accountQuery = await Account.findByEmail(email);

    if (!accountQuery.count) {
      throw makeApiError({ message: 'Incorrect email or password' });
    }

    const [account] = accountQuery;

    const isValidPassword = await passwordCompare(password, account.password);
    if (!isValidPassword) {
      throw makeApiError({ message: 'Incorrect password', status: 401 });
    }

    const jwt = await signToken(account.email);
    const jwtCookie = cookie.serialize(AUTH_TOKEN_COOKIE, jwt, {
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: ms('7 days'),
      domain: process.env.URL.replace('https://', ''),
    });

    return respondWithSuccess(
      { token: jwt },
      200,
      { 'Set-Cookie': jwtCookie },
    );
  } catch (error) {
    return respondWithError(makeApiError({
      error,
      message: 'Failed to login, try again?',
      status: 500,
    }));
  }
}

exports.handler = login;
