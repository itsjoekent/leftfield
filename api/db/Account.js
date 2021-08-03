const mongoose = require('./');

const schema = new mongoose.Schema({
  'email': {
    index: true,
    lowercase: true,
    type: String,
    unique: true,
  },
  'password': String,
  'firstName': String,
  'lastName': String,
  'organization': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  'role': String,
  'lastLoggedIn': Number,
}, {
  timestamps: true,
});

schema.pre('find', function() {
  this.populate('organization');
});

schema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
}

const Account = mongoose.model('Account', schema);

module.exports = Account;
