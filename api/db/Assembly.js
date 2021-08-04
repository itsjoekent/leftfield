const mongoose = require('./');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'description': {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
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

schema.index({ 'createdAt': 1 });

const Assembly = mongoose.model('Assembly', schema);

module.exports = Assembly;
