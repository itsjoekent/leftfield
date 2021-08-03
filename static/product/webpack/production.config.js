const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./base.config.js');
const environment = require(path.join(process.cwd(), 'environment/development.web'));

module.exports = merge(base, {
  devtool: 'source-map',
  plugins: [
    // TODO: Fix eslint, see: https://github.com/webpack/webpack-cli/issues/1622
    // new ESLintPlugin(),
    new webpack.DefinePlugin(environment),
  ],
});
