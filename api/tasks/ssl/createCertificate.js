const NODE_ENV = process.env.NODE_ENV;
const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const acme = require('acme-client');
const ms = require('ms');
const path = require('path');

const { upload } = require('../../utils/storage');
const cryptography = require(path.join(process.cwd(), 'ssl/cryptography'));

async function sleep(time = ms('30 seconds')) {
  console.log(`Sleeping for ${time / 1000} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = async function createCertificate(domainName) {
  try {
    logger.info(`Creating certificate for ${domainName}`);

    const accountKey = await acme.forge.createPrivateKey();

    const client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt[
        NODE_ENV === 'production' ? 'production' : 'staging'
      ],
      accountKey,
    });

    const [key, csr] = await acme.forge.createCsr({
      commonName: domainName,
    });

    async function createChallenge(auth, challenge, keyAuthorization) {
      if (challenge.type !== 'http-01') {
        console.log(`Unsupported ssl challenge type, "${challenge.type}" for ${domainName}`);
        throw new Error(`Unsupported ssl challenge type, "${challenge.type}" for ${domainName}`);
      }

      const challengeStorageKey = `acme-challenge/${domainName}/${challenge.token}`;
      await upload(challengeStorageKey, keyAuthorization, 'text/plain');

      await sleep();
    }

    console.log('Calling client.auto')

    const cert = await client.auto({
      csr,
      termsOfServiceAgreed: true,
      challengeCreateFn: createChallenge,
      challengePriority: ['http-01'],
    });

    console.log('Created cert');

    const data = {
      key: key.toString(),
      cert: cert.toString(),
      createdAt: Date.now(),
      expires: ms('90 days'),
    };

    console.log('Created data object')

    const certificateStorageKey = `ssl/${domainName}`;
    await upload(storageKey, cryptography.encrypt(SSL_AT_REST_KEY, data), 'text/plain');
  } catch (error) {
    return error;
  }
}
