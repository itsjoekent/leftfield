const cookie = require('cookie');
const ms = require('ms');
const Account = require('../db/Account');
const { passwordCompare, signToken, AUTH_TOKEN_COOKIE } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformAccount } = require('../utils/transformer');

async function login(request, response) {
  const { body } = request;

  await basicValidator(body, [
    { key: 'email', humanName: 'email' },
    { key: 'password', humanName: 'password' },
  ]);

  const { email, password } = body;

  const account = await Account.findByEmail(email);

  if (!account) {
    throw makeApiError({ message: 'Incorrect email or password' });
  }

  const isValidPassword = await passwordCompare(password, account.password);
  if (!isValidPassword) {
    throw makeApiError({ message: 'Incorrect password', status: 401 });
  }

  await Account.updateOne(
    { _id: account._id },
    { lastLoggedIn: Date.now() },
  );

  const isLocalHost = process.env.DOMAIN.includes('localhost');

  const jwt = await signToken({
    subject: account.email,
    subjectType: 'email',
  });

  const jwtCookie = cookie.serialize(AUTH_TOKEN_COOKIE, jwt, {
    path: '/',
    secure: true,
    sameSite: 'None',
    maxAge: ms('7 days') / 1000,
    domain: isLocalHost ? '' : process.env.DOMAIN,
  });

  return respondWithSuccess(
    response,
    { token: jwt, account: transformAccount(account, account) },
    200,
    { 'Set-Cookie': jwtCookie },
  );
}

module.exports = login;
