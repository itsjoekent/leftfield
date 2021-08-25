const EDGE_DOMAIN = process.env.EDGE_DOMAIN;
const HTTP_PORT = process.env.HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
const NODE_ENV = process.env.NODE_ENV;
const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL;
const REDIS_EDGE_URL = process.env.REDIS_EDGE_URL;

const fs = require('fs');
const https = require('https');
const path = require('path');

if (NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const Redis = require('ioredis');
const devcert = require('devcert');
const { v4: uuid } = require('uuid');

const logger = require('./logger');
const retrieveFile = require('./retrieveFile');
const retrieveSsl = require('./retrieveSsl');
const router = require('./router');
const sniLookup = require('./sniLookup');

const secureApp = router();
const insecureApp = router();

const redisCacheClient = new Redis(REDIS_CACHE_URL, { enableReadyCheck: true });
const redisEdgeClient = new Redis(REDIS_EDGE_URL, { enableReadyCheck: true });

function requestErrorHandler(error, response) {
  const errorId = uuid();
  logger.error(error, { httpErrorId: errorId });

  // TODO: return different content based on mimeType/path?
  response.set('X-LF-Error-Id', errorId);
  response.status(500).end();
}

function healthCheck(request, response) {
  res.status(200).send(`Homerun!`);
  return;
}

(async function () {
  try {
    let ssl = null;

    if (NODE_ENV === 'development') {
      ssl = await require(path.join(process.cwd(), 'ssl/read'))();
    } else {
      const { cert, key } = await retrieveSsl(EDGE_DOMAIN, redisEdgeClient);
      ssl = { cert, key };
    }

    const httpsOptions = {
      ...ssl,
      SNICallback: sniLookup(redisEdgeClient),
    };

    secureApp.get('/_leftfield/health-check', healthCheck);
    insecureApp.get('/_leftfield/health-check', healthCheck);

    // TODO: Serve static/www

    secureApp.get('*', async function handler(request, response) {
      try {
        const host = request.get('host').toLowerCase();
        const path = request.path.toLowerCase();

        if (EDGE_DOMAIN.includes(host)) {
          if (path.startsWith('/file')) {
            const key = path.replace('/file/', '');

            const respondWith = await retrieveFile(key, request, { redisCacheClient });

            if (respondWith) {
              respondWith(response);
              return;
            }
          }

          response.status(404).end();
          return;
        }

        // TODO:
        // - Lookup domain in redisEdgeClient
        // - Find published snapshot
        // - create key based on snapshot + path
        // - retrieveFile()

        response.status(404).end();
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    insecureApp.get(
      '/.well-known/acme-challenge/:token',
      async function (request, response) {
        try {
          const host = request.get('host').toLowerCase();
          const { token } = request.params;

          const ssl = await retrieveSsl(host);
          if (!ssl) {
            throw new Error(`Unable to locate acme challenge for ${host}`);
          }

          if (ssl.token !== token) {
            response.status(404).end();
            return;
          }

          response.set('Content-Type', 'text/plain');
          response.status(200).send(ssl.token);
        } catch (error) {
          requestErrorHandler(error, response);
        }
      },
    );

    insecureApp.get('*', async function (request, response) {
      try {
        const host = request.get('host').toLowerCase();
        const path = request.path.toLowerCase();

        if (NODE_ENV === 'development' && host.includes('localhost')) {
          response.redirect(`https://localhost:${HTTPS_PORT}${request.url}`);
          return;
        }

        response.redirect(`https://${host}${request.url}`);
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    redisCacheClient.on('ready', () => logger.info('Connected to Redis cache'));
    redisEdgeClient.on('ready', () => logger.info('Connected to Redis edge db'));

    redisCacheClient.on('error', () => logger.info('Error connecting to Redis cache'));
    redisEdgeClient.on('error', () => logger.info('Error connecting to Redis edge db'));

    const httpsServer = https.createServer(httpsOptions, secureApp);

    httpsServer.listen(HTTPS_PORT, () => logger.info(`Listening for https traffic on port:${HTTPS_PORT}`));
    insecureApp.listen(HTTP_PORT, () => logger.info(`Listening for http traffic on port:${HTTP_PORT}`));
  } catch (error) {
    logger.error('Fatal startup error, exiting...');
    logger.error(error);
    process.exit(1);
  }
})();