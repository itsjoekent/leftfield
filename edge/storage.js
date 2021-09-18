const STORAGE_MAIN_REGION = process.env.STORAGE_MAIN_REGION;
const STORAGE_REGIONS = process.env.STORAGE_REGIONS;

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const REGION = process.env.REGION;

const AWS = require('aws-sdk');
const { get } = require('lodash');

const logger = require('./logger');

const regions = {};

STORAGE_REGIONS.split(',').map((region) => {
  const bucket = process.env[`STORAGE_BUCKET_${region}`];

  regions[region] = {
    s3: new AWS.S3({
      endpoint: new AWS.Endpoint(process.env[`STORAGE_ENDPOINT_${region}`]),
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
    maxAttempts = STORAGE_REGIONS.split(',').length,
    redisCacheClient = null,
  } = options || {};

  const isRedisCacheReady = () => !!redisCacheClient && redisCacheClient.status === 'ready';

  if (isRedisCacheReady()) {
    try {
      const hit = await redisCacheClient.getBuffer(`file:${key}`);

      if (hit) {
        return hit;
      }
    } catch (error) {
      logger.error(error);
    }
  }

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

  if (isRedisCacheReady) {
    try {
      await redisCacheClient.set(`file:${key}`, buffer, 'PX', ms('1 day'));
    } catch (error) {
      logger.error(error);
    }
  }

  return buffer;
}

module.exports = {
  regions,
  getObject,
}
