const mongoose = require('./');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'name': {
    type: String,
  },
  'domain': {
    type: String,
  },
  'data': {
    type: Object,
  },
}, {
  timestamps: true,
});

schema.pre('find', function() {
  this.populate('organization');
});

const Website = mongoose.model('Websites', schema);

module.exports = Website;
