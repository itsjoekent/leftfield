const bcrypt = require('bcrypt');
const { get } = require('lodash');
const { SignJWT } = require('jose-node-cjs-runtime/jwt/sign');
const { jwtVerify } = require('jose/jwt/verify');
const { promisify } = require('util');
const crypto = require('crypto');
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

async function signToken(email, claims = {}, expiration = '7 days') {
  return await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('leftfield')
    .setSubject(email)
    .setExpirationTime('7 days')
    .sign(secretKey);
}

async function validateToken(token) {
  const { payload } = await jwtVerify(token, secretKey, { issuer: 'leftfield' });
  return payload;
}

async function validateAuthorizationHeader(event) {
  try {
    const authorizationHeader = get(event, 'headers.authorization');
    if (!authorizationHeader) {
      return makeApiError({
        message: 'Not authorized to perform this action',
        status: 401,
      });
    }

    const payload = await validateToken(authorizationHeader.replace('Bearer ', ''));
    const account = await Account.findByEmail(payload.sub);

    return account;
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
