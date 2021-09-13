const NODE_ENV = process.env.NODE_ENV;

const pino = require('pino');

const logger = pino({
  prettyPrint: NODE_ENV === 'development',
  redact: [
    'req.headers["x-leftfield-key"]',
  ],
});

module.exports = logger;
