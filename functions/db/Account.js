const dynamoose = require('./');

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
    type: String,
  },
  'password': String,
}, {
  'timestamps': true
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

// TODO: Build table name based on environment?
const Account = dynamoose.model('Accounts', schema, options);

module.exports = Account;
