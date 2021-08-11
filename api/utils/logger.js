const NODE_ENV = process.env.NODE_ENV;

const pino = require('pino');

const logger = pino({
  prettyPrint: NODE_ENV !== 'production',
  redact: NODE_ENV === 'production' ? [
    'req.headers.cookie',
    'req.headers.authorization',
  ] : [],
});

module.exports = logger;
