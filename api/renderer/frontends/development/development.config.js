const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const base = require('../base.config.js');
const environment = require('../../../../environment/local-development');

module.exports = merge(
  base('development'),
  {
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: 'main.js',
    },
    plugins: [
      new webpack.DefinePlugin(environment),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../template.html'),
      }),
    ],
  },
);
