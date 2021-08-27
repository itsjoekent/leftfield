const crypto = require('crypto');

const SEPERATOR = '__IV__';

function encrypt(encryptionKey, sslData) {
  const data = JSON.stringify(sslData);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted = `${iv.toString('hex')}${SEPERATOR}` + encrypted + cipher.final('hex');

  return encrypted;
}

function decrypt(encryptionKey, encryptedSslData) {
  const [decipherIv, encryptedString] = encryptedSslData.split(SEPERATOR);

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    encryptionKey,
    Buffer.from(decipherIv, 'hex'),
  );

  let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
  decrypted = decrypted + decipher.final('utf8');

  return JSON.parse(decrypted);
}

module.exports = { encrypt, decrypt };
