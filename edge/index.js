const DNS_ZONE = process.env.DNS_ZONE;
const EDGE_CACHE_KEY = process.env.EDGE_CACHE_KEY;
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
const storage = require('./storage');

const secureApp = router();
const insecureApp = router();

const redisCacheClient = new Redis(REDIS_CACHE_URL, {
  enableReadyCheck: true,
});

const edgeHost = new URL(EDGE_DOMAIN).host;

function requestErrorHandler(error, response) {
  const errorId = uuid();
  logger.error(error, { httpErrorId: errorId });

  // TODO: return different content based on mimeType/path?
  response.set('X-LF-Error-Id', errorId);
  response.status(500).end();
}

function healthCheck(request, response) {
  response.status(200).send('The Yankees Win!');
  return;
}

function removeTrailingSlash(input) {
  if (input === '/') {
    return input;
  }

  if (input.endsWith('/')) {
    return input.substring(0, input.length - 1);
  }

  return input;
}

function addIndexFile(path) {
  if (path.split('/').pop().includes('.')) {
    return path;
  }

  return `${path}/index.html`;
}

function getHost(request) {
  const host = (request.get('host') || '').toLowerCase();

  if (host.startsWith('www.')) {
    return host.replace('www.', '');
  }

  return host;
}

function getHostAndPath(request) {
  const path = request.path.toLowerCase();
  return [getHost(request), addIndexFile(removeTrailingSlash(path))];
}

(async function () {
  try {
    let ssl = null;

    if (NODE_ENV === 'development') {
      ssl = await require(path.join(process.cwd(), 'ssl/read'))();
    } else {
      const { cert, key } = await retrieveSsl('*.getleftfield.com', redisCacheClient);
      ssl = { cert, key };
    }

    const httpsOptions = {
      ...ssl,
      SNICallback: sniLookup(redisCacheClient),
    };

    secureApp.get('/_lf/health-check', healthCheck);
    insecureApp.get('/_lf/health-check', healthCheck);

    secureApp.post('/_lf/clear', async function handler(request, response) {
      try {
        const host = getHost(request);
        const key = request.headers['x-leftfield-key'];

        if (key !== EDGE_CACHE_KEY) {
          response.status(401).json({ error: 'not authorized' });
          return;
        }

        const sslDomain = host.includes(DNS_ZONE) ? `*.${DNS_ZONE}` : host;
        await redisCacheClient.del(`ssl:${sslDomain}`);

        await redisCacheClient.del(`file:published-version/${host}`);

        response.status(200).json({ cleared: true });
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    secureApp.post('/_lf/nuke', async function handler(request, response) {
      try {
        const host = getHost(request);
        const key = request.headers['x-leftfield-key'];

        if (key !== EDGE_CACHE_KEY) {
          response.status(401).json({ error: 'not authorized' });
          return;
        }

        await redisCacheClient.sendCommand(
          new Redis.Command('FLUSHALL', ['ASYNC']),
        );

        response.status(200).json({ cleared: true });
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    secureApp.get('/_lf/file/*', async function handler(request, response) {
      try {
        const key = request.path.toLowerCase().replace('/_lf/file/', '');
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
        const [host, path] = getHostAndPath(request);

        if (host === edgeHost) {
          const versionBuffer = await storage.getObject(`published-version/${edgeHost}`);
          if (!versionBuffer) {
            response.status(404).send('Looks like we made a bad error on the field, but don\'t worry we\'re looking into it!');
            return;
          }

          const version = versionBuffer.toString('utf8').replace('\n', '');
          let key = null;

          if ([
            '/dashboard',
            '/editor',
            '/login',
            '/logout',
            '/reset-password',
            '/signup',
          ].some((compare) => request.path.startsWith(compare))) {
            key = `static/${version}/product/index.html`;
          }

          if (!key) {
            key = `static/${version}${path}`;
          }

          const respondWith = await retrieveFile(key, request, { redisCacheClient });

          if (respondWith) {
            respondWith(response);
            return;
          }

          // TODO: return custom 404
          response.status(404).send('Page not found!');
          return;
        } else {
          next();
        }
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    secureApp.get('*', async function handler(request, response) {
      try {
        const [host, path] = getHostAndPath(request);

        const versionBuffer = await storage.getObject(`published-version/${host}`);
        if (!versionBuffer) {
          response.status(404).send('This website is not published yet!');
          return;
        }

        const version = versionBuffer.toString('utf8').replace('\n', '');
        const key = `snapshot/${version}${path}`;

        const respondWith = await retrieveFile(key, request, { redisCacheClient });

        if (respondWith) {
          respondWith(response);
          return;
        }

        // TODO: return custom 404
        response.status(404).send('Page not found!');
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    insecureApp.get('/.well-known/acme-challenge/:token', async function (request, response) {
      try {
        const { token } = request.params;

        const challenge = await storage.getObject(`acme-challenge/${token}`);

        if (!challenge) {
          response.status(404).end();
          return;
        }

        response.set('Content-Type', 'text/plain');
        response.status(200).send(challenge.toString('utf8'));
      } catch (error) {
        requestErrorHandler(error, response);
      }
    });

    insecureApp.get('*', async function (request, response) {
      try {
        const host = getHost(request);
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

    redisCacheClient.on('error', () => logger.info('Error connecting to Redis cache'));

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
