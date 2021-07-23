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
  },
}, {
  'timestamps': true
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

const Organization = dynamoose.model('Organizations', schema, options);

module.exports = Organization;
