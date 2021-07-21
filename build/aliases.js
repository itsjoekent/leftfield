const path = require('path');

module.exports = {
  '@editor': path.resolve(process.cwd(), '/src/editor'),

  'pkg.admin-components': path.resolve(process.cwd(), '/packages/admin-components'),
  'pkg.builder': path.resolve(process.cwd(), '/packages/builder'),
  'pkg.campaign-components': path.resolve(process.cwd(), '/packages/campaign-components'),
  'pkg.form-wizard': path.resolve(process.cwd(), '/packages/form-wizard'),
};
