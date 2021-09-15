const NODE_ENV = process.env.NODE_ENV;

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, `.env.${NODE_ENV}.web`) });

module.exports = {
  'process.env.API_DOMAIN': JSON.stringify(process.env.API_DOMAIN),
  'process.env.EDGE_DOMAIN': JSON.stringify(process.env.EDGE_DOMAIN),
  'process.env.PREVIEW_PATH': JSON.stringify(process.env.PREVIEW_PATH),
};
