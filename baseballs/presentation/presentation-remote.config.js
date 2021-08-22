const path = require('path');
const zlib = require('zlib');

const { v4: uuid } = require('uuid');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { merge } = require('webpack-merge');
const base = require('../base.config.js');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const distributionId = uuid();
const publicPath = `${process.env.EDGE_DOMAIN}/file/baseball/${distributionId}/`;

module.exports = merge(
  base('presentation-remote'),
  {
    devtool: 'source-map',
    entry: path.join(__dirname, 'main.js'),
    optimization: {
      sideEffects: true,
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name: 'vendor',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
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
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|json|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
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
