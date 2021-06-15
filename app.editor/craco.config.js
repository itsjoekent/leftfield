const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@editor': path.resolve(__dirname, 'src/editor'),
      '@simulator': path.resolve(__dirname, 'src/editor'),
    },
  },
};