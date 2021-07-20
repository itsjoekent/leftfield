const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./base.config.js');
const environment = require('../../../environment/local-staging');

module.exports = merge(base, {
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: process.env.EDITOR_APP_PORT,
    host: '0.0.0.0',
    hot: true,
  },
  devtool: 'source-map',
  plugins: [
    // TODO: Fix eslint, see: https://github.com/webpack/webpack-cli/issues/1622
    // new ESLintPlugin(),
    new webpack.DefinePlugin(environment),
  ],
});
