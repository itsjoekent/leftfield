const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const aliases = require('../build/aliases');

module.exports = (prefix) => ({
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
    path: path.join(process.cwd(), `/www/baseballs/${prefix}`),
    publicPath: `/baseballs/${prefix}`,
  },
  resolve: {
    alias: aliases,
  },
});
