const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('../base.config.js');
const preview = require('./preview.config.js');
const environment = require(path.join(process.cwd(), 'environment/development.web'));

module.exports = merge(
  base('preview-local'),
  preview,
  {
    devtool: 'source-map',
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: 'main.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './template.html'),
      }),
      new webpack.DefinePlugin(environment),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  },
);
