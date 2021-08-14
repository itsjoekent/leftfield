const path = require('path');

const { v4: uuid } = require('uuid');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { merge } = require('webpack-merge');
const base = require('../base.config.js');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const distributionId = uuid();
const publicPath = `${process.env.FILES_DOMAIN}/file/baseball/${distributionId}/`;

module.exports = merge(
  base('presentation-remote'),
  {
    devtool: 'source-map',
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: '[name].bundle.js',
      chunkFilename: (pathData, assetInfo) => {
        if (pathData.chunk.name) {
          return `${pathData.chunk.name.toLowerCase()}.js`;
        }

        return '[id].js';
      },
      publicPath,
    },
    plugins: [
      new CssMinimizerPlugin(),
      new StatsWriterPlugin({
        fields: [
          'publicPath',
          'outputPath',
          'assetsByChunkName',
        ],
      }),
    ],
    resolve: {
      alias: {
        '@baseballs': path.join(process.cwd(), '/baseballs'),
      },
    },
  },
);
