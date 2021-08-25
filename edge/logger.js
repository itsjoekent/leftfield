const NODE_ENV = process.env.NODE_ENV;

const pino = require('pino');

const logger = pino({
  prettyPrint: NODE_ENV !== 'production',
});

module.exports = logger;