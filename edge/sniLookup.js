const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const tls = require('tls');

const logger = require('./logger');
const retrieveSsl = require('./retrieveSsl');

module.exports = function sniLookup(redisEdgeClient) {
  async function _sniLookup(domain, callback) {
    try {
      if (NODE_ENV === 'development') {
        const ssl = await require(path.join(process.cwd(), 'ssl/read'))();
        return callback(null, tls.createSecureContext(ssl));
      }

      const ssl = await retrieveSsl(domain, redisEdgeClient);
      if (!ssl) {
        throw new Error(`Unable to locate SSL certificate for ${host}`);
      }

      const { cert, key } = ssl;
      return callback(null, tls.createSecureContext({ cert, key }));
    } catch (error) {
      logger.error(error, `Unable to locate SSL certificates for "${domain}"`);
      callback(error, null);
    }
  }

  return _sniLookup;
}
