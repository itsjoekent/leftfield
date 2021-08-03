const mongoose = require('./');

const schema = new mongoose.Schema({
  'name': {
    type: String,
  },
  'size': {
    type: String,
  },
}, {
  timestamps: true,
});

const Organization = mongoose.model('Organization', schema);

module.exports = Organization;
