const cluster = require('cluster');
const os = require('os');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const { get, uniq } = require('lodash');
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

      const { css, helmet, html, page } = ssr(state, route);

      const stats = require(path.join(process.cwd(), '/static/www/baseballs/presentation-remote/stats.json'));
      const { assetsByChunkName, publicPath } = stats;

      const mainChunk = get(assetsByChunkName, 'main', []);
      const vendorChunk = get(assetsByChunkName, 'vendor', []);

      const stylesheets = [
        `${process.env.FILES_DOMAIN}/file/${keyPrefix}/components.css`,
        ...mainChunk.filter((file) => file.endsWith('.css'))
          .map((file) => `${publicPath}${file}`.toLowerCase()),
      ];

      const mainScripts = mainChunk.filter((file) => file.endsWith('.js'))
        .map((file) => `${publicPath}${file}`.toLowerCase());

      const componentTags = uniq(
        Object.values(page.components).map((component) => component.tag)
      );

      const componentChunks = componentTags.reduce((acc, tag) => ([
        ...acc,
        ...get(assetsByChunkName, tag, []).filter((file) => file.endsWith('.js')),
      ]), []);

      const asyncScripts = [
        ...componentChunks,
        ...vendorChunk.filter((file) => file.endsWith('.js'))
      ].map((file) => `${publicPath}${file}`.toLowerCase());

      const dataUrl = `${process.env.FILES_DOMAIN}/file/${keyPrefix}/page-data.json`;

      const HTML_REPLACER = `%%%_HTML_${now}_%%%`;
      const rawIndex = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${stylesheets.map((stylesheet) => (
              `<link rel="stylesheet" href="${stylesheet}" />`
            )).join('\n')}
            <link rel="preload" href="${dataUrl}" as="fetch" crossorigin="anonymous">
          </head>
          <body>
            <div id="root">${HTML_REPLACER}</div>
            ${asyncScripts.map((script) => (
              `<script src="${script}" defer></script>`
            )).join('\n')}
            <script>window.__PAGE_DATA_URL__ = "${dataUrl}";</script>
            ${mainScripts.map((script) => (
              `<script src="${script}"></script>`
            )).join('\n')}
          </body>
        </html>
      `;

      const index = rawIndex.split('\n')
        .map((line) => line.trim())
        .join('')
        .replace(HTML_REPLACER, html);

      const filesToUpload = [
        ['page-data.json', JSON.stringify(page)],
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
