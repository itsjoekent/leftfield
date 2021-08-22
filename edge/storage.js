const STORAGE_MAIN_REGION = process.env.STORAGE_MAIN_REGION;
const STORAGE_REGIONS = process.env.STORAGE_REGIONS;

const STORAGE_KEY = process.env.STORAGE_KEY;
const STORAGE_SECRET = process.env.STORAGE_SECRET;

const REGION = process.env.REGION;

const AWS = require('aws-sdk');
const { get } = require('lodash');

const regions = {};

STORAGE_REGIONS.split(',').map((region) => {
  const bucket = process.env[`STORAGE_BUCKET_${region}`];

  regions[region] = {
    s3: new AWS.S3({
      endpoint: new AWS.Endpoint(process.env[`STORAGE_ENDPOINT_${region}`]),
      accessKeyId: STORAGE_KEY,
      secretAccessKey: STORAGE_SECRET,
    }),
    bucket,
  };
});

regions.main = regions[STORAGE_MAIN_REGION];

async function getObject(key, options) {
  const {
    region = REGION || STORAGE_MAIN_REGION,
    regionPool = STORAGE_REGIONS.split(','),
    attempts = 0,
    maxAttempts = 3,
  } = options || {};

  async function next() {
    const nextAttempts = attempts + 1;
    if (nextAttempts >= maxAttempts) {
      return null;
    }

    const nextPool = regionPool.filter((compare) => compare !== region);
    const nextRegion = nextPool.pop();

    if (!nextRegion) {
      return null;
    }

    return await getObject(
      key,
      {
        ...options,
        attempts: nextAttempts,
        region: nextRegion,
        regionPool: nextPool,
      },
    );
  }

  const { bucket, s3 } = get(regions, region, {});
  if (!s3) {
    return next();
  }

  let buffer = null;

  try {
    const { Body: objectBuffer } = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    buffer = objectBuffer;
  } catch (error) {
    if (get(error, 'code') !== 'NoSuchKey') {
      throw error;
    }
  }

  if (!buffer) {
    return next();
  }

  return buffer;
}

module.exports = {
  regions,
  getObject,
}
