const mongoose = require('./');
const Assembly = require('./Assembly');
const Organization = require('./Organization');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'name': {
    type: String,
    maxLength: 256,
  },
  'domain': {
    type: String,
  },
  'draftVersion': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assembly',
  },
  'publishedVersion': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assembly',
  },
}, {
  timestamps: true,
});

function populate() {
  this.populate('organization')
    .populate('draftVersion')
    .populate('publishedVersion');
}

schema.pre('find', populate);
schema.pre('findOne', populate);

schema.index({ 'name': 'text' });
schema.index({ 'createdAt': 1 });
schema.index({ 'updatedAt': 1 });

schema.statics.findAllForOrganization = function(
  organizationId = null,
  name = null,
  startAt = null,
  sortOn = 'updatedAt',
  sortDirection = -1,
  limit = 25,
) {
  const query = { organization: organizationId };

  if (name) {
    query['$text'] = { '$search': name, '$caseSensitive': false };
  }

  if (startAt) {
    query['_id'] = { '$gt': mongoose.Types.ObjectId(startAt) };
  }

  return this.find(query).sort({ [sortOn]: sortDirection }).limit(limit).exec();
};

const Website = mongoose.model('Website', schema);

module.exports = Website;
