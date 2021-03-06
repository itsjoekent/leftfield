const NODE_ENV = process.env.NODE_ENV;
const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const acme = require('acme-client');
const ms = require('ms');
const path = require('path');

const { upload } = require('../../utils/storage');
const cryptography = require(path.join(process.cwd(), 'ssl/cryptography'));

async function sleep(time = ms('30 seconds')) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = async function createCertificate(domainName, logger) {
  try {
    logger.info(`Creating certificate for ${domainName}`);

    const accountKey = await acme.forge.createPrivateKey();

    const client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt[
        NODE_ENV === 'production' ? 'production' : 'staging'
      ],
      accountKey,
    });

    const csrParams = {
      commonName: domainName,
    };

    if (domainName.split('.').length === 2) {
      csrParams.altNames = [`www.${domainName}`];
    }

    const [key, csr] = await acme.forge.createCsr({
      commonName: domainName,
    });

    async function createChallenge(auth, challenge, keyAuthorization) {
      if (challenge.type !== 'http-01') {
        throw new Error(`Unsupported ssl challenge type, "${challenge.type}" for ${domainName}`);
      }

      const challengeStorageKey = `acme-challenge/${challenge.token}`;
      await upload(challengeStorageKey, keyAuthorization, 'text/plain');

      await sleep();
    }

    const cert = await client.auto({
      csr,
      termsOfServiceAgreed: true,
      challengeCreateFn: createChallenge,
      challengePriority: ['http-01'],
    });

    const data = {
      key: key.toString(),
      cert: cert.toString(),
      createdAt: Date.now(),
      expires: ms('90 days'),
    };

    const certificateStorageKey = `ssl/${domainName}`;
    await upload(certificateStorageKey, cryptography.encrypt(SSL_AT_REST_KEY, data), 'text/plain');
  } catch (error) {
    return error;
  }
}
