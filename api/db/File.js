const mongoose = require('./');

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

schema.pre('find', function() {
  this.populate('organization')
    .populate('uploadedBy')
    .populate('lastUpdatedBy');
});

const File = mongoose.model('File', schema);

File.statics.findByFileKey = function(fileKey) {
  return this.findOne({ fileKey });
};

File.statics.findAllForOrganization = function(
  organizationId = null,
  fileTypes = null,
  name = null,
  startAt = null,
  sortOn = 'updatedAt',
  sortDirection = 1,
  limit = 25,
) {
  const query = { organizationId };

  if (name) {
    query['$text'] = { '$search': name, '$caseSensitive': true };
  }

  if (fileTypes) {
    query['fileType'] = { '$in': fileTypes };
  }

  if (startAt) {
    query['_id'] = { '$gt': mongoose.Types.ObjectId(startAt) };
  }

  return this.find(query).sort({ [sortOn]: sortDirection }).limit(limit);
});

module.exports = File;
