const mongoose = require('mongoose');
const Account = require('./Account');
const DataContainer = require('./DataContainer');
const DomainRecord = require('./DomainRecord');
const Organization = require('./Organization');
const Snapshot = require('./Snapshot');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'name': {
    type: String,
    maxLength: 256,
  },
  'domains': [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DomainRecord',
    },
  ],
  'draftSnapshot': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snapshot',
  },
  'publishedSnapshot': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snapshot',
  },
  'lastPublishedAt': {
    type: Number,
  },
  'lastPublishedBy': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
}, {
  timestamps: true,
});

function populate() {
  this.populate('organization')
    .populate('lastPublishedBy')
    .populate('domains');
}

schema.pre('find', populate);
schema.pre('findOne', populate);

schema.index({ 'name': 'text' });
schema.index({ 'domains': 1 });
schema.index({ 'createdAt': 1 });
schema.index({ 'updatedAt': 1 });

schema.statics.findAllForOrganization = function({
  organizationId = null,
  name = null,
  startAt = null,
  sortOn = 'updatedAt',
  sortDirection = -1,
  limit = 25,
  fillDraftSnapshot = false,
  fillSnapshotRoute = null,
}) {
  const findQuery = { organization: organizationId };

  if (name) {
    findQuery['$text'] = { '$search': name, '$caseSensitive': false };
  }

  if (startAt) {
    findQuery['_id'] = { '$gt': mongoose.Types.ObjectId(startAt) };
  }

  let query = this.find(findQuery);

  if (fillDraftSnapshot) {
    const populate = {
      path: 'draftSnapshot',
      model: Snapshot,
      populate: [
        {
          path: 'assembly',
          model: DataContainer,
        },
        {
          path: 'createdBy',
          model: Account,
        },
      ],
    };

    if (fillSnapshotRoute) {
      populate.populate.push({
        path: `pages.${fillSnapshotRoute}`,
        model: DataContainer,
      });
    }

    query = query.populate(populate);
  }

  return query.sort({ [sortOn]: sortDirection }).limit(limit).exec();
};

const Website = mongoose.model('Website', schema);

module.exports = Website;
