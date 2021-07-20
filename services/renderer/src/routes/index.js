const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.RENDERER_API_PORT;

const path = require('path');

const express = require('express');
const pinoHttp = require('pino-http');

const logger = require('../utils/logger');

const httpLogger = pinoHttp({ logger });

const app = express();
app.use(httpLogger);

const distribution = `/dist/preview-${NODE_ENV === 'development' ? 'local' : 'remote'}`;

app.use('/preview', express.static(path.join(process.cwd(), distribution)));

app.get('/preview', (req, res) => {
  res.sendFile(path.join(process.cwd(), distribution, 'index.html'));
});

app.listen(PORT, () => {
  logger.info(`Listening on PORT:${PORT} in NODE_ENV:${NODE_ENV}`);
});
