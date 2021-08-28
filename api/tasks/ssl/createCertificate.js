const NODE_ENV = process.env.NODE_ENV;
const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const acme = require('acme-client');
const ms = require('ms');
const path = require('path');

const { upload } = require('../../utils/storage');
const cryptography = require(path.join(process.cwd(), 'ssl/cryptography'));

module.exports = async function createCertificate(domainName) {
  const accountKey = await acme.forge.createPrivateKey();

  const client = new acme.Client({
    directoryUrl: acme.directory.letsencrypt[
      NODE_ENV === 'development' ? 'staging' : 'production'
    ],
    accountKey,
  });

  const [key, csr] = await acme.forge.createCsr({
    commonName: domainName,
  });

  let token = null;
  let tokenContents = null;

  function createChallenge(auth, challenge, keyAuthorization) {
    if (challenge.type !== 'http-01') {
      throw new Error(`Unsupported ssl challenge type, "${challenge.type}" for ${domainName}`);
    }

    token = challenge.token;
    tokenContents = keyAuthorization;
  }

  const cert = await client.auto({
    csr,
    termsOfServiceAgreed: true,
    challengeCreateFn: createChallenge,
    challengePriority: ['http-01'],
  });

  const data = {
    token,
    tokenContents,
    key: key.toString(),
    cert: cert.toString(),
    createdAt: Date.now(),
    expires: ms('90 days'),
  };

  const storageKey = `ssl/${domainName}`;
  await upload(storageKey, cryptography.encrypt(SSL_AT_REST_KEY, data), 'text/plain');
}
