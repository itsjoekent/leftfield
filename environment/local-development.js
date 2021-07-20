const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local-development') });

const base = require('./base-local');
module.exports = base;
