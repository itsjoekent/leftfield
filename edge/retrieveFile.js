const STORAGE_MAIN_REGION = process.env.STORAGE_MAIN_REGION;
const STORAGE_REGIONS = process.env.STORAGE_REGIONS;

const DEFAULT_MAX_AGE = Number(process.env.DEFAULT_MAX_AGE);
const REGION = process.env.REGION;

const path = require('path');

const ms = require('ms');
const bytes = require('bytes');
const { get } = require('lodash');

const { regions } = require('./storage');

const CACHE_SEPARATOR = '<--meta|lf|data-->';

const compressionRegex = new RegExp(/\.(js|json|css|html|svg)$/);
function isCompressible(key) {
  return compressionRegex.test(key);
}

function isCacheable(fileSize) {
  return fileSize <= bytes('1mb');
}

async function retrieveFile(key, request, options) {
  const {
    region = REGION || STORAGE_MAIN_REGION,
    regionPool = STORAGE_REGIONS.split(','),
    attempts = 0,
    maxAttempts = 3,
    redisCacheClient = null,
  } = options || {};

  const acceptEncoding = request.get('Accept-Encoding');
  const isCompressed = key.endsWith('.br');

  const isRedisCacheReady = () => redisCacheClient && redisCacheClient.status === 'ready';

  if (
    !isCompressed
    && isCompressible(key)
    && (acceptEncoding || '').includes('br')
  ) {
    const compressedKey = `${key}.br`;
    const compressedRespondWith = await retrieveFile(compressedKey, request, {
      ...options,
      maxAttempts: 1,
    });

    if (compressedRespondWith) {
      return compressedRespondWith;
    }
  }

  function buildResponseHeadersFromMeta(response, meta) {
    response.set('Accept-Ranges', get(meta, 'AcceptRanges'));
    response.set('Cache-Control', `max-age=${DEFAULT_MAX_AGE}, public, must-revalidate`);
    response.set('Content-Length', get(meta, 'ContentLength'));
    response.set('Content-Type', get(meta, 'ContentType'));
    response.set('Date', new Date().toUTCString());
    response.set('ETag', get(meta, 'ETag'));
    response.set('Last-Modified', get(meta, 'LastModified'));

    if (isCompressed) {
      response.set('Content-Encoding', 'br');
    }
  }

  function respondWithGenerator(meta, buffer) {
    function respondWith(response) {
      buildResponseHeadersFromMeta(response, meta);
      response.status(200);
      response.end(buffer);
    }

    return respondWith;
  }

  function respondWithNotModifiedGenerator(meta) {
    function respondWith(response) {
      buildResponseHeadersFromMeta(response, meta);
      response.status(304).end();
    }

    return respondWith;
  }

  const ifNoneMatch = request.get('If-None-Match');
  const ifModifiedSince = request.get('If-Modified-Since');

  if (isRedisCacheReady()) {
    const hit = await redisCacheClient.getBuffer(`file:${key}`);

    if (hit) {
      const [metaString, fileString] = hit.toString('utf8').split(CACHE_SEPARATOR);

      const meta = JSON.parse(metaString);
      const fileBuffer = Buffer.from(fileString, 'hex');

      return respondWithGenerator(meta, fileBuffer);
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

    return await retrieveFile(
      key,
      request,
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

  let meta = null;

  try {
    meta = await s3.headObject({ Bucket: bucket, Key: key }).promise();
  } catch (error) {
    if (get(error, 'code') !== 'NotFound') {
      throw error;
    }
  }

  if (!meta) {
    return next();
  }

  if (ifNoneMatch && get(meta, 'ETag') === ifNoneMatch) {
    return respondWithNotModifiedGenerator(meta);
  }

  if (ifModifiedSince) {
    const ifModifiedSinceDate = new Date(ifModifiedSince).getTime();
    const lastModifiedDate = new Date(get(meta, 'LastModified')).getTime();

    if (lastModifiedDate > ifModifiedSinceDate) {
      return respondWithNotModifiedGenerator(meta);
    }
  }

  const { Body: fileBuffer } = await s3.getObject({ Bucket: bucket, Key: key }).promise();

  if (isRedisCacheReady() && isCacheable(get(meta, 'ContentLength'))) {
    const cacheBuffer = Buffer.from(`${JSON.stringify(meta)}${CACHE_SEPARATOR}${fileBuffer.toString('hex')}`);
    await redisCacheClient.set(`file:${key}`, cacheBuffer, 'PX', ms('1 day'));
  }

  return respondWithGenerator(meta, fileBuffer);
}

module.exports = retrieveFile;
