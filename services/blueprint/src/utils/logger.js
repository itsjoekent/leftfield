const NODE_ENV = process.env.NODE_ENV;

const pino = require('pino');

const prettyPrintOptions = {
  colorize: true,
};

const logger = pino({
  prettyPrint: NODE_ENV === 'development' ? prettyPrintOptions : false,
});

module.exports = logger;
