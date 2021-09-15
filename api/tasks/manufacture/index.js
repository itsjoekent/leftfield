const NODE_ENV = process.env.NODE_ENV;

const cluster = require('cluster');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

if (NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const { get, uniq } = require('lodash');

const mongoose = require('../../db');
const DataContainer = require('../../db/DataContainer');
const Snapshot = require('../../db/Snapshot');
const Website = require('../../db/Website');
const { consumer } = require('../../queue/manufacture');
const getFileType = require('../../utils/getFileType');
const logger = require('../../utils/logger');
const { upload } = require('../../utils/storage');

logger.child({ task: 'manufacture' });

function removeTrailingSlash(input) {
  return input.replace(/\/$/, '');
}

consumer.process(1, async function(job) {
  logger.child({ jobId: get(job, 'id') });

  try {
    delete require.cache[require.resolve('./ssr.build.js')];
    const { default: ssr } = require('./ssr.build.js');

    const { data: { snapshotId } } = job;

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
        `${process.env.EDGE_DOMAIN}/file/${keyPrefix}/components.css`,
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

      const dataUrl = `${process.env.EDGE_DOMAIN}/file/${keyPrefix}/page-data.json`;

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

      const pageDataJson = JSON.stringify(page);

      const brotliParams = {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      };

      const filesToUpload = [
        ['page-data.json', pageDataJson],
        ['page-data.json.br', zlib.brotliCompressSync(pageDataJson, brotliParams)],
        ['components.css', css],
        ['components.css.br', zlib.brotliCompressSync(css, brotliParams)],
        ['index.html', index],
        ['index.html.br', zlib.brotliCompressSync(index, brotliParams)],
      ];

      for (const [, file] of filesToUpload.entries()) {
        const [fileName, data] = file;

        const mimeType = getFileType(fileName);
        const buffer = Buffer.from(data);

        const key = `${keyPrefix}${removeTrailingSlash(route)}/${fileName}`.toLowerCase();

        await upload(key, buffer, mimeType);
      }
    }

    const website = await Website.findById(snapshot.website).exec();
    for (const domainRecord of website.domains) {
      await upload(`published-version/${domainRecord.name}`, snapshotId, 'text/plain');
    }

    // CLEAR CACHE

    logger.info(`Completed snapshotId:${snapshotId}`);

    return true;
  } catch (error) {
    logger.error(error);
  }
});

if (cluster.isPrimary && NODE_ENV !== 'development') {
  const totalProcessors = os.cpus().length;
  logger.info(`Spawning ${totalProcessors} manufacture worker(s)...`);

  for (let index = 0; index < totalProcessors; index++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Build Worker [PID=${worker.process.pid}] died with code=${code} signal=${signal}`);
    cluster.fork();
  });
}
