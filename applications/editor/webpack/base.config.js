const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
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
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, `/dist`),
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
    alias: {
      '@editor': path.resolve(__dirname, '../src'),

      // Ensure that dependencies use app.editor modules
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'styled-components': path.resolve('./node_modules/styled-components'),
    },
  },
};
