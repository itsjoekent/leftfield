const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.BLUEPRINT_API_PORT;

const { randomBytes } = require('crypto');

const express = require('express');
const pinoHttp = require('pino-http');

const { logger } = require('pkg.technician');

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.__id,
});

const app = express();

app.use(async (req, res, next) => {
  const buffer = randomBytes(32);
  req.__id = buffer.toString('hex');
  next();
});

app.use(httpLogger);

app.get('/', (req, res) => {
  res.send('hello');
});

const router = express.Router();

require('./login')(router);

app.use('/api', router);

app.listen(PORT, () => {
  logger.info(`Listening on PORT:${PORT} in NODE_ENV:${NODE_ENV}`);
});
