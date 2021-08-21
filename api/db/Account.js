const mongoose = require('mongoose');
const Organization = require('./Organization');

const schema = new mongoose.Schema({
  'email': {
    index: true,
    lowercase: true,
    type: String,
    unique: true,
  },
  'password': String,
  'avatar': String,
  'name': String,
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'role': String,
  'lastLoggedIn': Number,
}, {
  timestamps: true,
});

function populate() {
  this.populate('organization');
}

schema.pre('find', populate);
schema.pre('findOne', populate);

schema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
}

const Account = mongoose.model('Account', schema);

module.exports = Account;
