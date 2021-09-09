const NODE_ENV = process.env.NODE_ENV;

const pino = require('pino');

const logger = pino({
  prettyPrint: NODE_ENV === 'development',
  redact: NODE_ENV !== 'development' ? [
    'req.headers.cookie',
    'req.headers.authorization',
  ] : [],
});

module.exports = logger;
