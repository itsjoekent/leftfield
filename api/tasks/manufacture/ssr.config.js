const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'ssr.js'),
  output: {
    filename: 'ssr.build.js',
    path: __dirname,
    library: {
      name: 'manufacture',
      type: 'umd',
    },
  },
  mode: process.env.NODE_ENV,
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
        test: /\.(md)$/i,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /\.css$/,
        loader: 'ignore-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@product': path.join(process.cwd(), '/static/product'),
      '@baseballs': path.join(process.cwd(), '/baseballs'),
    },
  },
  target: 'node',
};
