const DNSIMPLE_ACCOUNT_ID = process.env.DNSIMPLE_ACCOUNT_ID;
const DNSIMPLE_API_TOKEN = process.env.DNSIMPLE_API_TOKEN;
const ENVIRONMENTS = process.env.ENVIRONMENTS;
const WILDCARD_DOMAIN = process.env.WILDCARD_DOMAIN;

const crypto = require('crypto');

const acme = require('acme-client');
const AWS = require('aws-sdk');
const dnsimple = require('dnsimple');
const ms = require('ms');

const dnsClient = dnsimple({
  accessToken: DNSIMPLE_API_TOKEN,
});

const storage = ENVIRONMENTS.split(',').map((environment) => {
  function getEnv(key) {
    return process.env[`${environment}_${key}`];
  }

  const S3 = new AWS.S3({
    endpoint: new AWS.Endpoint(getEnv('STORAGE_PRIMARY_ENDPOINT')),
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
  });

  return {
    S3,
    bucket: getEnv('STORAGE_PRIMARY_BUCKET'),
    cipher: crypto.createCipheriv('aes256', getEnv('SSL_AT_REST_KEY'), Buffer.alloc(16, 0)),
  };
});

(async function generateWildcard() {
  try {
    console.log(`Generating wildcard certificate for ${WILDCARD_DOMAIN}`);

    const accountKey = await acme.forge.createPrivateKey();

    const client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt.production,
      accountKey,
    });

    const [key, csr] = await acme.forge.createCsr({
      commonName: `*.${WILDCARD_DOMAIN}`,
    });

    let token = null;
    let tokenContents = null;

    async function createChallenge(auth, challenge, keyAuthorization) {
      console.log(`Creating "${challenge.type}" challenge...`);

      if (challenge.type === 'http-01') {
        token = challenge.token;
        tokenContents = keyAuthorization;
      } else if (challenge.type === 'dns-01') {
        const dnsRecord = `_acme-challenge.${auth.identifier.value}`;
        const recordValue = keyAuthorization;

        await dnsimple.zones.createZoneRecord(
          DNSIMPLE_ACCOUNT_ID,
          WILDCARD_DOMAIN,
          {
            content: recordValue,
            name: dnsRecord,
            type: 'TXT',
            ttl: 3600
          },
        );
      } else {
        throw new Error(`Unsupported challenge type "${challenge.type}"`);
      }
    }

    const cert = await client.auto({
      csr,
      termsOfServiceAgreed: true,
      challengeCreateFn: createChallenge,
    });

    console.log(`Uploading certificate to ${ENVIRONMENTS.split(',').join(', ').toLowerCase()} storage...`);

    const data = JSON.stringify({
      token,
      tokenContents,
      key: key.toString(),
      cert: cert.toString(),
      createdAt: Date.now(),
      expires: ms('90 days'),
    });

    await Promise.all(storage.map(({ S3, bucket, cipher }) => {
      let encryptedData = cipher.update(data, 'utf8', 'hex');
      encryptedData += cipher.final('hex');

      return S3.upload({
        Body: encryptedData,
        Bucket: bucket,
        ContentType: 'text/plain',
        Key: `ssl/*.${WILDCARD_DOMAIN}`,
      }).promise()
    }));

    console.log('Done!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
