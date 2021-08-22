const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'website': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  },
  'name': {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
  },
  'verified': {
    type: Boolean,
    default: false,
  },
  'lastCheckedDns': {
    type: Number,
  },
  'lastObtainedSslOn': {
    type: Number,
  },
}, {
  timestamps: true,
});

const DomainRecord = mongoose.model('DomainRecord', schema);

module.exports = DomainRecord;
