const dynamoose = require('./');
const Account = require('./Account');

const schema = new dynamoose.Schema({
  'id': {
    hashKey: true,
    type: String,
  },
  'name': {
    type: String,
  },
  'size': {
    type: String,
  },
  'team': {
    type: Array,
    schema: [
      {
        type: 'Object',
        schema: {
          'accountId': {
            type: String,
          },
          'role': {
            type: String,
          },
        },
      },
    ],
  },
  'websites': {
    type: Array,
    schema: [String],
    default: [],
  },
}, {
  'timestamps': true
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

const Organization = dynamoose.model('Organizations', schema, options);

Organization.methods.set('findById', async function(id) {
  const organizationQuery = await this.query('id').eq(id).exec();
  const [organization] = organizationQuery;

  return organization;
});

module.exports = Organization;
