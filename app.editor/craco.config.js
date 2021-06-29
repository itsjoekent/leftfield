const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@editor': path.resolve(__dirname, 'src'),
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'styled-components': path.resolve('./node_modules/styled-components'),
    },
  },
};
