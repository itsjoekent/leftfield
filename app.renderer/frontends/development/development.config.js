const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const base = require('../base.config.js');

module.exports = merge(
  base('development'),
  {
    entry: path.join(__dirname, 'main.js'),
    output: {
      filename: 'main.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../template.html'),
      }),
    ],
  },
);
