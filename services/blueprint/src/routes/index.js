const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.BLUEPRINT_API_PORT;

const express = require('express');
const pinoHttp = require('pino-http');

const logger = require('../utils/logger');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  logger.info(`Listening on PORT:${PORT} in NODE_ENV:${NODE_ENV}`);
});
