const cookie = require('cookie');
const ms = require('ms');
const Account = require('../db/Account');
const Organization = require('../db/Organization');
const Website = require('../db/Website');
const { passwordHash, signToken, AUTH_TOKEN_COOKIE } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { ADMIN } = require('../utils/roles');

async function signup(request, response) {
  const { body } = request;

  await basicValidator(body, [
    { key: 'email', humanName: 'email' },
    { key: 'password', humanName: 'password' },
    { key: 'name', humanName: 'name' },
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
    name,
    organizationName,
    organizationSize,
  } = body;

  const hashedPassword = await passwordHash(password);

  const organization = await Organization.create({
    name: organizationName,
    size: organizationSize,
  });

  await Account.create({
    email,
    name,
    password: hashedPassword,
    organization: organization._id,
    role: 'OWNER',
    lastLoggedIn: Date.now(),
  });

  const isLocalHost = process.env.DOMAIN.includes('localhost');

  const jwt = await signToken({
    subject: email,
    subjectType: 'email',
  });

  const jwtCookie = cookie.serialize(AUTH_TOKEN_COOKIE, jwt, {
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: ms('7 days') / 1000,
    domain: isLocalHost ? '' : process.env.DOMAIN,
  });

  return respondWithSuccess(
    response,
    { token: jwt },
    200,
    { 'Set-Cookie': jwtCookie },
  );
}

module.exports = signup;
