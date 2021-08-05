const AWS = require('aws-sdk');

const spaces = {
  ny: new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.SPACES_ENDPOINT_NY),
    accessKeyId: process.env.SPACES_KEY_NY,
    secretAccessKey: process.env.SPACES_SECRET_NY,
  }),
  sf: new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.SPACES_ENDPOINT_SF),
    accessKeyId: process.env.SPACES_KEY_SF,
    secretAccessKey: process.env.SPACES_SECRET_SF,
  }),
}

function getSignedUploadUrls(fileKey) {
  const expireSeconds = 60 * 5

  const sharedConfig = {
    ACL: 'public-read',
    Key: fileKey,
    ContentType: 'application/octet-stream',
    Expires: expireSeconds,
  };

  return [
    spaces.ny.getSignedUrl('putObject', {
      Bucket: process.env.SPACES_NAME_NY,
      ...sharedConfig,
    }),
    spaces.sf.getSignedUrl('putObject', {
      Bucket: process.env.SPACES_NAME_SF,
      ...sharedConfig,
    }),
  ];
}

// TODO: Upload

module.exports = {
  spaces,
  getSignedUploadUrls,
};
