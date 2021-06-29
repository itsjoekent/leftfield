const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const express = require('express');
const pinoHttp = require('pino-http');

const logger = require('../utils/logger');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

app.listen('*', async (req, res) => {
  try {
    // ...
  } catch (error) {
    logger.error(error);
  }
});

app.listen(PORT, () => {
  logger.info(`Listening on PORT:${PORT} in NODE_ENV:${NODE_ENV}`);
});
