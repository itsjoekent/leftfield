const mongoose = require('./');
const Account = require('./Account');
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
  'uploadedBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  'lastUpdatedBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  'fileKey': {
    type: String,
    index: true,
    unique: true,
  },
  'fileSize': {
    type: Number,
  },
  'fileType': {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
});

schema.index({ 'name': 'text' });
schema.index({ 'createdAt': 1 });
schema.index({ 'updatedAt': 1 });

function populate() {
  this.populate('organization')
    .populate('uploadedBy')
    .populate('lastUpdatedBy');
}

schema.pre('find', populate);
schema.pre('findOne', populate);

schema.statics.findByFileKey = function(fileKey) {
  return this.findOne({ fileKey });
};

schema.statics.findAllForOrganization = function(
  organizationId = null,
  fileTypes = null,
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

  if (fileTypes) {
    query['fileType'] = { '$in': fileTypes };
  }

  if (startAt) {
    const operator = sortDirection > 1 ? '$gt' : '$lt';
    query['_id'] = { [operator]: mongoose.Types.ObjectId(startAt) };
  }

  return this.find(query).sort({ [sortOn]: sortDirection }).limit(limit).exec();
};

const File = mongoose.model('File', schema);

module.exports = File;
