const package = require('./package.json');
const path = require('path');
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
  ],
  resolve: {
    alias: {
      '@cc': path.resolve(__dirname, 'src/'),
    },
  },
};
