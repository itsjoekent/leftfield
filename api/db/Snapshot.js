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
  'assembly': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataContainer',
  },
  'pages': {
    type: mongoose.Schema.Types.Mixed,
    // key = route<String>, value = DataContainer
  },
  'createdBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  'description': String,
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
});

schema.index({ createdAt: 1 });

const Snapshot = mongoose.model('Snapshot', schema);

module.exports = Snapshot;
