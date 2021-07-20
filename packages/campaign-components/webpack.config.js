const package = require('./package.json');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  externals: {
    'react': 'react',
    'styled-components': 'styled-components',
  },
  module: {
    rules: [
     {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: package.name,
    libraryTarget: 'umd',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    alias: {
      '@cc': path.resolve(__dirname, 'src/'),
    },
    fallback: {
      'fs': false,
      'module': false,
      'os': false,
      'path': false,
      'url': false,
      'util': false,
    },
  },
  stats: {
    warningsFilter: [/critical dependency:/i],
  },
};
