const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.(md)$/i,
      use: {
        loader: 'raw-loader',
      },
    });

    config.resolve.alias = { '@cc': path.resolve(__dirname, '../src/') };

    return config;
  },
}
