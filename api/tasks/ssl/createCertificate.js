const NODE_ENV = process.env.NODE_ENV;

const acme = require('acme-client');
const ms = require('ms');

const { upload } = require('../../utils/storage');

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

  function createChallenge(auth, challenge, key) {
    if (challenge.type !== 'http-01') {
      throw new Error(`Unsupported ssl challenge type, "${challenge.type}" for ${domainName}`);
    }

    token = challenge.token;
  }

  const cert = await client.auto({
    csr,
    termsOfServiceAgreed: true,
    challengeCreateFn: createChallenge,
    challengePriority: ['http-01'],
  });

  const data = JSON.stringify({
    token,
    key: key.toString(),
    cert: cert.toString(),
    createdAt: Date.now(),
    expires: ms('90 days'),
  });

  const storageKey = `ssl/${domainName}`;
  await upload(storageKey, data, 'application/json');
}
