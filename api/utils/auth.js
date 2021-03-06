const bcrypt = require('bcrypt');
const { get } = require('lodash');
const { SignJWT } = require('jose-node-cjs-runtime/jwt/sign');
const { jwtVerify } = require('jose-node-cjs-runtime/jwt/verify');
const { promisify } = require('util');
const crypto = require('crypto');
const makeApiError = require('./makeApiError');
const Account = require('../db/Account');

const randomBytes = promisify(crypto.randomBytes);

const secretKey = crypto.createSecretKey(Buffer.from(process.env.AUTH_TOKEN_SECRET, 'utf8'));

const AUTH_TOKEN_COOKIE = 'lf_auth';

async function randomToken(length = 64) {
  try {
    const token = await randomBytes(length);
    return token.toString('hex');
  } catch (error) {
    return error;
  }
}

async function passwordHash(plaintext) {
  try {
    const result = await bcrypt.hash(plaintext, 12);
    return result;
  } catch (error) {
    return error;
  }
}

async function passwordCompare(plaintext, hashed) {
  try {
    const comparison = await bcrypt.compare(plaintext, hashed);
    return comparison;
  } catch (error) {
    return error;
  }
}

async function signToken({
  subject,
  subjectType,
  claims = {},
  expiration = '7 days',
  prefix = 'p',
  secret = secretKey,
}) {
  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('leftfield')
    .setSubject(`${subjectType}_${subject}`)
    .setExpirationTime('7 days')
    .sign(secret);

  return `lf${prefix}_${jwt}`;
}

async function validateToken(token, secret = secretKey) {
  const jwt = token.split(/_(.+)/)[1];
  const { payload } = await jwtVerify(jwt, secret, { issuer: 'leftfield' });
  return payload;
}

async function validateAuthorizationHeader(request) {
  try {
    const authorizationHeader = request.get('authorization');
    if (!authorizationHeader) {
      return makeApiError({
        message: 'Not authorized to perform this action',
        status: 401,
      });
    }

    const payload = await validateToken(authorizationHeader.replace('Bearer ', ''));
    const [subjectType, subject] = payload.sub.split(/_(.+)/);

    if (subjectType === 'email') {
      const account = await Account.findByEmail(subject);

      if (!account) {
        return makeApiError({
          error,
          message: 'Not authorized to perform this action',
          status: 401,
        });
      }

      return account;
    }

    return makeApiError({
      message: 'Not authorized to perform this action',
      status: 401,
    });
  } catch (error) {
    return makeApiError({
      error,
      message: 'Not authorized to perform this action',
      status: 401,
    });
  }
}

module.exports = {
  randomBytes,
  randomToken,
  passwordHash,
  passwordCompare,
  signToken,
  validateToken,
  validateAuthorizationHeader,
  AUTH_TOKEN_COOKIE,
}
