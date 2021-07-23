const { v4: uuid } = require('uuid');
const cookie = require('cookie');
const ms = require('ms');
const dynamoose = require('./db');
const Account = require('./db/Account');
const Organization = require('./db/Organization');
const Website = require('./db/Website');
const { passwordHash, signToken, AUTH_TOKEN_COOKIE } = require('./utils/auth');
const basicValidator = require('./utils/basicValidator');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');
const { ADMIN } = require('./utils/roles');

async function signup(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');

    await basicValidator(data, [
      { key: 'email', humanName: 'email' },
      { key: 'password', humanName: 'password' },
      { key: 'firstName', humanName: 'first name' },
      { key: 'organizationName', humanName: 'organization name' },
      { key: 'organizationSize', humanName: 'organization size' },
      {
        key: 'email',
        errorMessage: 'Email already in use',
        validationFunction: async function(email) {
          const account = await Account.findByEmail(email);
          return !account;
        },
      },
    ]);

    const {
      email,
      password,
      firstName,
      organizationName,
      organizationSize,
    } = data;

    const accountId = uuid();
    const organizationId = uuid();

    const hashedPassword = await passwordHash(password);

    await dynamoose.transaction([
      Account.transaction.create({
        id: accountId,
        email,
        firstName,
        password: hashedPassword,
        organizationId,
      }),
      Organization.transaction.create({
        id: organizationId,
        name: organizationName,
        size: organizationSize,
        team: [
          {
            accountId,
            role: ADMIN,
          },
        ],
      }),
    ]);

    const jwt = await signToken(email);
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
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to signup, try again?',
      status: 500,
    }));
  }
}

exports.handler = signup;
