const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const mime = require('mime');
const md5 = require('md5');

const { put } = require(path.join(process.cwd(), '/api/utils/cloudflareKeyValue'));
const { upload } = require(path.join(process.cwd(), '/api/utils/spaces'));

(async function() {
  try {
    console.log('Uploading baseball...');
    const stats = require(path.join(process.cwd(), '/static/www/baseballs/presentation-remote/stats.json'));

    const { publicPath, outputPath } = stats;
    const keyPrefix = publicPath.replace(`${process.env.FILES_DOMAIN}/file/`, '');

    console.log(`Public path: "${publicPath}"`);

    const buildDirectory = await fs.promises.readdir(outputPath);

    for (const fileName of buildDirectory) {
      if (fileName === 'stats.json') {
        continue;
      }

      console.log(`Uploading "${fileName}"...`);

      const fileContents = await fs.promises.readFile(path.join(outputPath, fileName));

      const mimeType = mime.getType(fileName);

      const now = Date.now();
      const meta = {
        createdAt: now,
        etag: md5(fileContents.toString('utf8')),
        fileSize: Buffer.byteLength(fileContents),
        lastModifiedAt: now,
        mimeType,
      };

      const key = `${keyPrefix}${fileName}`.toLowerCase();

      await Promise.all([
        upload(key, fileContents),
        put(process.env.CF_FILES_NAMESPACE_ID, key, meta),
      ]);
    }

    console.log('Finished upload.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
