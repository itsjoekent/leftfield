const crypto = require('crypto');

crypto.randomBytes(256, (err, randomBytes) => {
  if (err) throw err;

  console.log(
    crypto.scryptSync(
      randomBytes.toString('hex'),
      'salt',
      24,
    ).toString('hex')
  );
});
