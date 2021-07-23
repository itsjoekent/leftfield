const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('../base.config.js');
const environment = require(path.join(process.cwd(), 'environment/development'));

module.exports = merge(
  base('preview-local'),
  {
    devtool: 'source-map',
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: 'main.js',
    },
    plugins: [
      new webpack.DefinePlugin(environment),
    ],
  },
);
