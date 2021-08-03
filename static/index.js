const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const https = require('https');
const path = require('path');

const handler = require('serve-handler');
const pino = require('pino');
const pinoHttps = require('pino-http');

const logger = pino({
  prettyPrint: NODE_ENV !== 'production',
});

const httpLogger = pinoHttps({ logger });

(async function () {
  try {
    let httpsOptions = {};

    if (NODE_ENV !== 'production') {
      const ssl = await require('devcert').certificateFor('localhost');

      httpsOptions = Object.assign(httpsOptions, ssl);
    }

    const server = https.createServer(httpsOptions, (request, response) => {
      httpLogger(request, response);

      handler(request, response, {
        cleanUrls: true,
        directoryListing: NODE_ENV !== 'production',
        public: path.join(__dirname, 'www'),
        rewrites: [
          { source: '/dashboard', destination: '/product/index.html' },
          { source: '/dashboard/*', destination: '/product/index.html' },
          { source: '/editor', destination: '/product/index.html' },
          { source: '/login', destination: '/product/index.html' },
          { source: '/signup', destination: '/product/index.html' },
        ],
        trailingSlash: false,
      })
    });

    server.listen(PORT);
    logger.info(`Listening on port:${PORT}`);
  } catch (error) {
    logger.error('Fatal startup error, exiting...');
    logger.error(error);
    process.exit(1);
  }
})();
