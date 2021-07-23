const dynamoose = require('./');
const Organization = require('./Organization');

const schema = new dynamoose.Schema({
  'id': {
    hashKey: true,
    type: String,
  },
  'email': {
    index: {
      name: 'emailIndex',
      global: true,
    },
    set: (value) => value.toLowerCase(),
    type: String,
  },
  'password': String,
  'organizationId': {
    type: String,
  },
}, {
  'timestamps': true,
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

// TODO: Build table name based on environment?
const Account = dynamoose.model('Accounts', schema, options);

Account.methods.set('findByEmail', async function(email) {
  return this.query('email').eq(email.toLowerCase()).using('emailIndex').exec();
});

module.exports = Account;
