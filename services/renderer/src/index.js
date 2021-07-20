if (process.env.NODE_ENV === 'development') {
  require('../../../environment/local-development');
}

const logger = require('./utils/logger');

logger.debug('Starting up...');

require('./routes');
