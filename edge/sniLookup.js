const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const tls = require('tls');

module.exports = function sniLookup(logger, campaignsClient) {
  async function _sniLookup(domain, callback) {
    try {
      if (NODE_ENV === 'development') {
        const ssl = await require(path.join(process.cwd(), 'ssl/read'))();
        return callback(null, tls.createSecureContext(ssl));
      }

      // lookup domain in redis
      // then create securecontext
      // https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
      throw new Error('Unhandled functionality...');
    } catch (error) {
      logger.error(error, `Unable to locate SSL certificates for "${domain}"`);
      callback(error, null);
    }
  }

  return _sniLookup;
}
