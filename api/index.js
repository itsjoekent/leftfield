const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const https = require('https');
const fs = require('fs');
const path = require('path');

if (NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const cors = require('cors');
const express = require('express');
const pinoHttps = require('pino-http');

const mongoose = require('./db');
const logger = require('./utils/logger');
const routeWrapper = require('./utils/routeWrapper');

const app = express();
const httpLogger = pinoHttps({ logger });

app.use(httpLogger);
app.use(express.json());

app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'Leftfield');
  next();
});

(async function () {
  try {
    app.post('/dns/:domainRecordId/verify', routeWrapper('verify-domain'));
    app.post('/file', routeWrapper('upload-file'));
    app.post('/login', routeWrapper('login'));
    app.post('/request-password-reset', routeWrapper('request-password-reset'));
    app.post('/reset-password', routeWrapper('reset-password'));
    app.get('/organization/files', routeWrapper('get-organization-files'));
    app.get('/organization/websites', routeWrapper('get-organization-websites'));
    app.get('/profile', routeWrapper('get-profile'));
    app.put('/profile', routeWrapper('update-profile'));
    app.post('/signup', routeWrapper('signup'));
    app.post('/website', routeWrapper('create-website'));
    app.get('/website/:websiteId', routeWrapper('get-website'));
    app.put('/website/:websiteId', routeWrapper('update-website'));
    app.post('/website/:websiteId/publish', routeWrapper('publish-website'));
    app.post('/website/:websiteId/dns', routeWrapper('add-domain'));
    app.delete('/website/:websiteId/dns/:domainRecordId', routeWrapper('delete-domain'));

    function listen() {
      if (NODE_ENV === 'development') {
        https.createServer({
          key: fs.readFileSync(path.join(__dirname, '/certs/tls.key')),
          cert: fs.readFileSync(path.join(__dirname, '/certs/tls.cert')),
        }, app).listen(PORT);
      } else {
        app.listen(PORT);
      }

      logger.info(`Listening on port:${PORT}`);
    }

    const db = mongoose.connection;

    db.on('error', (error) => {
      throw error;
    });

    db.once('open', listen);
  } catch (error) {
    logger.error('Fatal startup error, exiting...');
    logger.error(error);
    process.exit(1);
  }
})();
