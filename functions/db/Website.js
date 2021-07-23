const dynamoose = require('./');
const Organization = require('./Organization');

const schema = new dynamoose.Schema({
  'id': {
    hashKey: true,
    type: String,
  },
  'organizationId': {
    type: String,
  },
  name: {
    type: String,
  },
  domain: {
    type: String,
  },
  data: {
    type: Object,
  },
}, {
  'timestamps': true,
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
  saveUnknown: [
    'data.**',
  ],
};

const Website = dynamoose.model('Websites', schema, options);

module.exports = Website;
