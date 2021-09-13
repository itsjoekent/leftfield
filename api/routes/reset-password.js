const crypto = require('crypto');
const cookie = require('cookie');
const ms = require('ms');
const mongoose = require('mongoose');
const Account = require('../db/Account');
const { signToken, validateToken, AUTH_TOKEN_COOKIE } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const { respondWithSuccess } = require('../utils/responder');
const { transformAccount } = require('../utils/transformer');

async function requestPasswordReset(request, response) {
  const { body } = request;

  await basicValidator(body, [
    { key: 'id', humanName: 'account identifier' },
    { key: 'password', humanName: 'password' },
    { key: 'token', humanName: 'reset token' },
  ]);

  const { id, password, token } = body;
  const account = await Account.findById(mongoose.Types.ObjectId(id));

  if (!account) {
    throw makeApiError({ message: 'No account exists for this password reset attempt' });
  }

  await validateToken(
    token,
    crypto.createSecretKey(
      Buffer.from(`${account.password}-${account.createdAt}`, 'utf8'),
    ),
  );

  const jwt = await signToken({
    subject: account.email,
    subjectType: 'email',
  });

  const isLocalHost = process.env.API_DOMAIN.includes('localhost');

  const jwtCookie = cookie.serialize(AUTH_TOKEN_COOKIE, jwt, {
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: ms('7 days') / 1000,
    domain: isLocalHost ? '' : process.env.API_DOMAIN,
  });

  await Account.updateOne(
    { _id: account._id },
    { lastLoggedIn: Date.now() },
  );

  return respondWithSuccess(
    response,
    { token: jwt, account: transformAccount(account, account) },
    200,
    { 'Set-Cookie': jwtCookie },
  );
}

module.exports = requestPasswordReset;
