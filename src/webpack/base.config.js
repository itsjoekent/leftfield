const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const aliases = require('../../build/aliases');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: path.join(process.cwd(), '/src/index.js'),
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
        },
      },
      {
        test: /\.(md)$/i,
        use: {
          loader: 'raw-loader',
        },
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(process.cwd(), `dist`),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './template.html'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    alias: aliases,
  },
};
