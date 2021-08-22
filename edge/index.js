const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const FILES_DOMAIN = process.env.FILES_DOMAIN;
const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL;

const fs = require('fs');
const https = require('https');
const path = require('path');

if (NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const express = require('express');
const Redis = require('ioredis');
const pinoHttp = require('pino-http');
const devcert = require('devcert');
const { v4: uuid } = require('uuid');

const logger = require('./logger');
const retrieveFile = require('./retrieveFile');
const sniLookup = require('./sniLookup');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'Leftfield');
  next();
});

const redisCacheClient = new Redis(REDIS_CACHE_URL, { enableReadyCheck: true });

(async function () {
  try {
    const ssl = await require(path.join(process.cwd(), 'ssl/read'))();
    const httpsOptions = {
      ...ssl,
      SNICallback: sniLookup(logger, null),
    };

    app.get('*', async function handler(request, response) {
      try {
        const host = request.get('host').toLowerCase();
        const path = request.path.toLowerCase();

        if (FILES_DOMAIN.includes(host)) {
          if (path.startsWith('/file')) {
            const key = path.replace('/file/', '');

            // TODO: Initial region by distance, sort pool by distance
            const respondWith = await retrieveFile(key, request, { redisCacheClient });

            if (respondWith) {
              respondWith(response);
              return;
            }
          }

          response.status(404).end();
          return;
        }

        response.status(404).end();
      } catch (error) {
        const errorId = uuid();
        logger.error(error, { httpErrorId: errorId });

        // TODO: return different content based on mimeType/path?
        response.set('X-LF-Error-Id', errorId);
        response.status(500).end();
      }
    });

    redisCacheClient.on('ready', () => logger.info('Connected to Redis cache'));

    const server = https.createServer(httpsOptions, app);
    server.listen(PORT, () => logger.info(`Listening on port:${PORT}`));
  } catch (error) {
    logger.error('Fatal startup error, exiting...');
    logger.error(error);
    process.exit(1);
  }
})();
