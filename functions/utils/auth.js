const bcrypt = require('bcrypt');
const { SignJWT } = require('jose-node-cjs-runtime/jwt/sign');
const { promisify } = require('util');
const crypto = require('crypto');

const randomBytes = promisify(crypto.randomBytes);

const secretKey = crypto.createSecretKey(Buffer.from(process.env.AUTH_TOKEN_SECRET, 'utf8'));

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
    const result = await bcrypt.hash(plaintext, 10);
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

async function signToken(account) {
  return await new SignJWT({ testClaim: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('leftfield')
    .setAudience(account.email)
    .setExpirationTime(exp)
    .sign(secretKey);
}

async function validateToken(token) {

}

module.exports = {
  randomBytes,
  randomToken,
  passwordHash,
  passwordCompare,
}
