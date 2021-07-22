const dynamoose = require('dynamoose');

dynamoose.aws.sdk.config.update({
  'accessKeyId': process.env.LEFTFIELD_AWS_ACCESS_KEY_ID,
  'secretAccessKey': process.env.LEFTFIELD_AWS_SECRET_ACCESS_KEY,
  'region': 'us-east-1'
});

module.exports = dynamoose;
