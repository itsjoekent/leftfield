const NODE_ENV = process.env.NODE_ENV;

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        sideEffects: true,
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
    path: path.join(process.cwd(), `/static/www/baseballs/${prefix}`),
    publicPath: `/baseballs/${prefix}`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
});
