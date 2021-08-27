const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const crypto = require('crypto');
const ms = require('ms');

const logger = require('./logger');
const retrieveFile = require('./retrieveFile');
const { getObject } = require('./storage');

module.exports = async function retrieveSsl(domainName, redisEdgeClient) {
  function buildResponse(sslData) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      SSL_AT_REST_KEY,
      Buffer.alloc(16, 0),
    );

    const decrypted = Buffer.concat([
      decipher.update(sslData, 'hex'),
      decipher.final(),
    ]).toString('utf8');

    const ssl = JSON.parse(sslData);

    return ssl;
  }

  if (redisEdgeClient && redisEdgeClient.status === 'ready') {
    const sslData = await redisEdgeClient.get(`ssl:${domainName}`);

    if (sslData) {
      return buildResponse(sslData);
    }
  }

  const sslBuffer = await getObject(`ssl/${domainName}`);
  if (sslBuffer) {
    const sslData = sslBuffer.toString();

    if (redisEdgeClient && redisEdgeClient.status === 'ready') {
      try {
        await redisEdgeClient.set(`ssl:${domainName}`, sslData, 'PX', ms('1 day'));
      } catch (error) {
        logger.error(error);
      }
    }

    return buildResponse(sslData);
  }

  return null;
}
