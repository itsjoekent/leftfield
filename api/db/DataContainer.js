const mongoose = require('./');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'website': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  },
  data: {
    type: String,
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
});

const DataContainer = mongoose.model('DataContainer', schema);

module.exports = DataContainer;
