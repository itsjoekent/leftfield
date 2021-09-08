const DNS_ZONE = process.env.DNS_ZONE;
const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const tls = require('tls');

const logger = require('./logger');
const retrieveSsl = require('./retrieveSsl');

const USE_WILDCARD = [
  DNS_ZONE,
  'cplb.rtb-dsp.com', // AWS health check
];

module.exports = function sniLookup(redisCacheClient) {
  async function _sniLookup(domain, callback) {
    try {
      if (NODE_ENV === 'development') {
        const ssl = await require(path.join(process.cwd(), 'ssl/read'))();
        return callback(null, tls.createSecureContext(ssl));
      }

      const sslDomain = USE_WILDCARD.some((compare) => domain.includes(compare)) ? `*.${DNS_ZONE}` : domain;
      const ssl = await retrieveSsl(sslDomain, redisCacheClient);

      if (!ssl) {
        throw new Error(`Unable to locate SSL certificate for ${sslDomain}`);
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
