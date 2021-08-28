const express = require('express');
const pinoHttp = require('pino-http');

const logger = require('./logger');

const httpLogger = pinoHttp({ logger });

module.exports = () => {
  const app = express();
  app.use(httpLogger);

  app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'Leftfield');

    if (process.env.REGION) {
      response.set('X-LF-Region', process.env.REGION);
    }

    next();
  });

  return app;
};
