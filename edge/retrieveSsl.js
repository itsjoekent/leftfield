const SSL_AT_REST_KEY = process.env.SSL_AT_REST_KEY;

const ms = require('ms');
const path = require('path');

const logger = require('./logger');
const retrieveFile = require('./retrieveFile');
const { getObject } = require('./storage');

const cryptography = require(path.join(process.cwd(), 'ssl/cryptography'));

module.exports = async function retrieveSsl(domainName, redisCacheClient) {
  try {
    function buildResponse(sslData) {
      const ssl = cryptography.decrypt(SSL_AT_REST_KEY, sslData);

      return ssl;
    }

    const sslBuffer = await getObject(`ssl/${domainName}`, { redisCacheClient });
    if (sslBuffer) {
      const sslData = sslBuffer.toString();

      return buildResponse(sslData);
    }

    return null;
  } catch (error) {
    return error;
  }
}
