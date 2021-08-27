const crypto = require('crypto');

console.log(
  crypto.scryptSync(
    crypto.randomBytes(256).toString('hex'),
    `${Date.now()}`,
    16,
  ).toString('hex')
);
