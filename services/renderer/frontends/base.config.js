const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const BLOCK_STORAGE_PATH = process.env.BLOCK_STORAGE_PATH;

function baseWebpackConfig(bundleId) {
  return {
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
            ]
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      path: path.join(__dirname, `/bundles/${bundleId}/dist`),
    },
    resolve: {
      alias: {
        'react': path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        'styled-components': path.resolve('./node_modules/styled-components'),
      },
    },
  };
}

module.exports = baseWebpackConfig;
