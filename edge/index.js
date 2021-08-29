const EDGE_DOMAIN = process.env.EDGE_DOMAIN;
const HTTP_PORT = process.env.HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
const NODE_ENV = process.env.NODE_ENV;
const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL;
const REDIS_EDGE_URL = process.env.REDIS_EDGE_URL;

const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

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

// TODO:
// Error: Unable to locate SSL certificate for cplb.rtb-dsp.com

const redisCacheClient = new Redis(REDIS_CACHE_URL, {
  enableReadyCheck: true,

  // TODO:
  // temp:
  retryStrategy: () => null,
});

const redisEdgeClient = new Redis(REDIS_EDGE_URL, {
  enableReadyCheck: true,

  // TODO:
  // temp:
  retryStrategy: () => null,
});

console.log(REDIS_CACHE_URL);

const edgeHost = new URL(EDGE_DOMAIN).host;

function requestErrorHandler(error, response) {
  const errorId = uuid();
  logger.error(error, { httpErrorId: errorId });

  // TODO: return different content based on mimeType/path?
  response.set('X-LF-Error-Id', errorId);
  response.status(500).end();
}

function healthCheck(request, response) {
  response.status(200).send(`Homerun!`);
  return;
}

(async function () {
  try {
    let ssl = null;

    if (NODE_ENV === 'development') {
      ssl = await require(path.join(process.cwd(), 'ssl/read'))();
    } else {
      const { cert, key } = await retrieveSsl('*.getleftfield.com', redisEdgeClient);
      ssl = { cert, key };
    }

    const httpsOptions = {
      ...ssl,
      SNICallback: sniLookup(redisEdgeClient),
    };

    secureApp.get('/_lf/health-check', healthCheck);
    insecureApp.get('/_lf/health-check', healthCheck);

    secureApp.get('/_lf/file/', async function handler(request, response) {
      try {
        const path = request.path.toLowerCase();
        const key = path.replace('/_lf/file/', '');

        const respondWith = await retrieveFile(key, request, { redisCacheClient });

        if (respondWith) {
          respondWith(response);
          return;
        }

        response.status(404).end();
        return;
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    secureApp.get('*', async function handler(request, response, next) {
      try {
        const host = (request.get('host') || '').toLowerCase();

        if (host === edgeHost) {
          response.send('homerun!');
          // TODO:
          // - Lookup domain in redisEdgeClient
          // - Find published product version
          // - create key based on published version + product type (SPA vs SSR) + path
          // - retrieveFile()
        } else {
          next();
        }
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    secureApp.get('*', async function handler(request, response) {
      try {
        const host = (request.get('host') || '').toLowerCase();
        const path = request.path.toLowerCase();

        response.send('grandslam!');

        // TODO:
        // - Lookup domain in redisEdgeClient
        // - Find published snapshot
        // - create key based on snapshot + path
        // - retrieveFile()

        // response.status(404).end();
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
          response.status(200).send(ssl.tokenContents);
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
    const httpServer = insecureApp.listen(HTTP_PORT, () => logger.info(`Listening for http traffic on port:${HTTP_PORT}`));

    process.on('SIGTERM', function() {
      httpsServer.close();
      httpServer.close();
    });
  } catch (error) {
    logger.error('Fatal startup error, exiting...');
    logger.error(error);
    process.exit(1);
  }
})();
