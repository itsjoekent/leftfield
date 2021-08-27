const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DNSIMPLE_ACCOUNT_ID = process.env.DNSIMPLE_ACCOUNT_ID;
const DNSIMPLE_API_TOKEN = process.env.DNSIMPLE_API_TOKEN;
const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;
const STORAGE_PRIMARY_BUCKET = process.env.STORAGE_PRIMARY_BUCKET;
const STORAGE_PRIMARY_ENDPOINT = process.env.STORAGE_PRIMARY_ENDPOINT;
const WILDCARD_DOMAIN = process.env.WILDCARD_DOMAIN;

const crypto = require('crypto');

const acme = require('acme-client');
const aws = require('aws-sdk');
const dnsimple = require('dnsimple');
const ms = require('ms');

const dnsClient = dnsimple({
  accessToken: DNSIMPLE_API_TOKEN,
});

const cipher = crypto.createCipheriv('aes256', SSL_AT_REST_KEY, Buffer.alloc(16, 0));

const S3 = new AWS.S3({
  endpoint: new AWS.Endpoint(STORAGE_PRIMARY_ENDPOINT),
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
          DNSIMPLE_ACCOUNT_ID
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

    console.log(`Uploading certificate to edge storage...`);

    const data = JSON.stringify({
      token,
      tokenContents,
      key: key.toString(),
      cert: cert.toString(),
      createdAt: Date.now(),
      expires: ms('90 days'),
    });

    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    await s3.upload({
      Body: encryptedData,
      Bucket: STORAGE_PRIMARY_BUCKET,
      ContentType: 'text/plain',
      Key: `ssl/*.${WILDCARD_DOMAIN}`,
    }).promise();

    console.log('Done!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
