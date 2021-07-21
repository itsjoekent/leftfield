const { promisify } = require('util');
const jsonwebtoken = require('jsonwebtoken');

const signAsync = promisify(jsonwebtoken.sign);
const verifyAsync = promisify(jsonwebtoken.verify);

async function sign(
  secret,
  subject,
  payload = {},
  expiresIn = '2 days',
) {
  try {
    const token = await signAsync(
      payload,
      secret,
      {
        expiresIn,
        issuer: 'leftfield',
        subject,
      },
    );

    return token;
  } catch (error) {
    return error;
  }
}

async function verify(secret, token) {
  try {
    const decoded = await verifyAsync(
      token,
      {
        issuer: 'leftfield',
      },
      secret,
    );

    return decoded;
  } catch (error) {
    return error;
  }
}

module.exports = {
  sign,
  verify,
};
