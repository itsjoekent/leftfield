const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('../base.config.js');
const environment = require(path.join(process.cwd(), 'environment/base-local'));

module.exports = merge(
  base('preview-remote'),
  {
    devtool: 'source-map',
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: 'main.js',
    },
    plugins: [
      new webpack.DefinePlugin(environment),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      fallback: {
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        fs: false,
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/')
      },
    },
  },
);
