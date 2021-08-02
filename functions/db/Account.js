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
      project: true,
    },
    set: (value) => value.toLowerCase(),
    type: String,
  },
  'password': String,
  'firstName': String,
  'lastName': String,
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

const Account = dynamoose.model('Accounts', schema, options);

Account.methods.set('findById', async function(id) {
  const accountQuery = await this.query('id').eq(id).exec();
  const [account] = accountQuery;

  return account;
});

Account.methods.set('findByEmail', async function(email) {
  const accountQuery = await this.query('email').eq(email.toLowerCase()).using('emailIndex').exec();
  const [account] = accountQuery;

  return account;
});

module.exports = Account;
