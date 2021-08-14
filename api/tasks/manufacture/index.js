const cluster = require('cluster');
const os = require('os');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const { get } = require('lodash');
const md5 = require('md5');
const mime = require('mime');

const mongoose = require('../../db');
const DataContainer = require('../../db/DataContainer');
const Snapshot = require('../../db/Snapshot');
const { consumer } = require('../../utils/buildQueue');
const { put } = require('../../utils/cloudflareKeyValue');
const logger = require('../../utils/logger');
const { upload } = require('../../utils/spaces');

logger.child({ task: 'build' });

consumer.process(1, async function(job) {
  try {
    delete require.cache[require.resolve('./ssr.build.js')];
    const { default: ssr } = require('./ssr.build.js');

    const { id, data: { snapshotId } } = job;

    const now = Date.now();
    const keyPrefix = `snapshot/${snapshotId}/${now}`;

    logger.info(`Building snapshotId:${snapshotId}, uploading to ${keyPrefix}`);

    const snapshot = await Snapshot
      .findById(mongoose.Types.ObjectId(snapshotId))
      .populate('assembly')
      .exec();

    if (!snapshot) {
      throw new Error(`Failed to load given snapshotId:${snapshotId}`);
    }

    const { assembly: { data }, pages } = snapshot;
    const parsedAssemblyData = JSON.parse(data);

    for (const [route, pageId] of Object.entries(pages)) {
      logger.debug(`Building page:${route} of snapshotId:${snapshotId}`);

      const pageDataContainer = await DataContainer
        .findById(mongoose.Types.ObjectId(pageId))
        .exec();

      const parsedPageData = JSON.parse(pageDataContainer.data);

      const state = {
        assembly: {
          ...parsedAssemblyData,
          pages: {
            [route]: parsedPageData,
          },
        },
      };

      const { css, html, page } = ssr(state, route);

      const stats = require(path.join(process.cwd(), '/static/www/baseballs/presentation-remote/stats.json'));
      const { assetsByChunkName, publicPath } = stats;

      const main = get(assetsByChunkName, 'main', []);

      const stylesheets = [
        `${process.env.FILES_DOMAIN}/file/${keyPrefix}/components.css`,
        ...main.filter((file) => file.endsWith('.css'))
          .map((file) => `${publicPath}${file}`.toLowerCase()),
      ];

      const scripts = main.filter((file) => file.endsWith('.js'))
        .map((file) => `${publicPath}${file}`.toLowerCase());

      const HTML_REPLACER = `%%%_HTML_${now}_%%%`;
      const index = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${stylesheets.map((stylesheet) => (
              `<link rel="stylesheet" href="${stylesheet}" />`
            )).join('\n')}
          </head>
          <body>
            <div id="root">${HTML_REPLACER}</div>
            <script id="__PAGE_DATA__" type="application/json">${JSON.stringify(page)}</script>
            ${scripts.map((script) => (
              `<script src="${script}"></script>`
            )).join('\n')}
          </body>
        </html>
      `.split('\n')
        .map((line) => line.trim())
        .join('')
        .replace(HTML_REPLACER, html);

      const filesToUpload = [
        ['components.css', css],
        ['index.html', index],
      ];

      for (const [, file] of filesToUpload.entries()) {
        const [fileName, data] = file;

        const mimeType = mime.getType(fileName);
        const buffer = Buffer.from(data);

        const meta = {
          createdAt: now,
          etag: md5(data),
          fileSize: Buffer.byteLength(buffer),
          lastModifiedAt: now,
          mimeType,
        };

        const key = `${keyPrefix}/${fileName}`.toLowerCase();

        await Promise.all([
          upload(key, buffer),
          put(process.env.CF_FILES_NAMESPACE_ID, key, meta),
        ]);
      }
      // create http2 push array
      //  - everything in assetsByChunkName.main
      //  - for each component in page,
      //    - each asset under assetsByChunkName.[componentTag]
    }

    logger.info(`Completed snapshotId:${snapshotId}`);

    return true;
  } catch (error) {
    logger.error(error);
    throw error; // @NOTE: Forcing queue to retry
  }
});

if (cluster.isPrimary) {
  const totalProcessors = os.cpus().length;
  logger.info(`Spawning ${totalProcessors} build worker(s)...`);

  for (let index = 0; index < totalProcessors; index++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Build Worker [PID=${worker.process.pid}] died with code=${code} signal=${signal}`);
    cluster.fork();
  });
}
