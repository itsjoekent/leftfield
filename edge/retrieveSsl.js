const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const ms = require('ms');
const path = require('path');

const logger = require('./logger');
const retrieveFile = require('./retrieveFile');
const { getObject } = require('./storage');

const cryptography = require(path.join(process.cwd(), 'ssl/cryptography'));

module.exports = async function retrieveSsl(domainName, redisCacheClient) {
  function buildResponse(sslData) {
    const ssl = cryptography.decrypt(SSL_AT_REST_KEY, sslData)

    return ssl;
  }

  if (redisCacheClient && redisCacheClient.status === 'ready') {
    const sslData = await redisCacheClient.get(`ssl:${domainName}`);

    if (sslData) {
      return buildResponse(sslData);
    }
  }

  const sslBuffer = await getObject(`ssl/${domainName}`);
  if (sslBuffer) {
    const sslData = sslBuffer.toString();

    if (redisCacheClient && redisCacheClient.status === 'ready') {
      try {
        await redisCacheClient.set(`ssl:${domainName}`, sslData, 'PX', ms('1 day'));
      } catch (error) {
        logger.error(error);
      }
    }

    return buildResponse(sslData);
  }

  return null;
}
