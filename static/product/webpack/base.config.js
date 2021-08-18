const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: path.join(process.cwd(), '/static/product/index.js'),
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
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
        test: /\.svg$/,
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: {
              removeViewBox: false,
            },
          },
        },
      },
      {
        test: /\.(md)$/i,
        loader: 'raw-loader',
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(process.cwd(), `/static/www/product`),
    publicPath: '/product/',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    alias: {
      '@product': path.resolve(process.cwd(), '/static/product'),
      '@assets': path.resolve(process.cwd(), '/static/assets'),
    },
    fallback: {
      'fs': false,
      'tls': false,
      'net': false,
      'os': false,
      'path': false,
      'zlib': false,
      'http': false,
      'https': false,
      'stream': false,
      'crypto': false,
    },
  },
};
