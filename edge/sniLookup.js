const EDGE_DOMAIN = process.env.EDGE_DOMAIN;
const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const tls = require('tls');
const { URL } = require('url');

const logger = require('./logger');
const retrieveSsl = require('./retrieveSsl');

const edgeHost = new URL(EDGE_DOMAIN).host;

module.exports = function sniLookup(redisEdgeClient) {
  async function _sniLookup(domain, callback) {
    try {
      if (NODE_ENV === 'development') {
        const ssl = await require(path.join(process.cwd(), 'ssl/read'))();
        return callback(null, tls.createSecureContext(ssl));
      }

      const sslDomain = domain.includes(edgeHost) ? `*.${edgeHost}` : domain;
      const ssl = await retrieveSsl(sslDomain, redisEdgeClient);

      if (!ssl) {
        throw new Error(`Unable to locate SSL certificate for ${domain}`);
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
