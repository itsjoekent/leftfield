const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const getFileType = require(path.join(process.cwd(), '/api/utils/getFileType'));
const { upload } = require(path.join(process.cwd(), '/api/utils/storage'));

(async function() {
  try {
    console.log('Uploading baseball...');
    const stats = require(path.join(process.cwd(), '/static/www/baseballs/presentation-remote/stats.json'));

    const { publicPath, outputPath } = stats;
    const keyPrefix = publicPath.replace(`/_lf/file/`, '');

    console.log(`Public path: "${publicPath}"`);

    const buildDirectory = await fs.promises.readdir(outputPath);

    for (const fileName of buildDirectory) {
      if (fileName === 'stats.json') {
        continue;
      }

      console.log(`Uploading "${fileName}"...`);

      const fileContents = await fs.promises.readFile(path.join(outputPath, fileName));

      const mimeType = getFileType(fileName);
      const key = `${keyPrefix}${fileName}`.toLowerCase();

      await upload(key, fileContents, mimeType);
    }

    console.log('Finished upload.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
