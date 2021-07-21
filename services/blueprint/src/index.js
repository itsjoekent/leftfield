const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
  require('../../../environment/local-development');
}

const { logger } = require('pkg.technician');

logger.debug('Starting up...');

require('./routes');
