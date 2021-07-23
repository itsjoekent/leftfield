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
  'name': {
    type: String,
  },
  'domain': {
    type: String,
  },
  'data': {
    type: Object,
  },
}, {
  saveUnknown: [
    'data.**',
  ],
  'timestamps': true,
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

const Website = dynamoose.model('Websites', schema, options);

Website.methods.set('findById', async function(id) {
  const websiteQuery = await this.query('id').eq(id).exec();
  const [website] = websiteQuery;

  return website;
});

module.exports = Website;
