const STORAGE_MAIN_REGION = process.env.STORAGE_MAIN_REGION;
const STORAGE_REGIONS = process.env.STORAGE_REGIONS;

const AWS = require('aws-sdk');

const regions = {};

STORAGE_REGIONS.split(',').map((region) => {
  const bucket = process.env[`STORAGE_BUCKET_${region}`];

  regions[region] = {
    s3: new AWS.S3({
      endpoint: new AWS.Endpoint(process.env[`STORAGE_ENDPOINT_${region}`]),
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
    bucket,
  };
});

regions.main = regions[STORAGE_MAIN_REGION];

function getSignedUploadUrl(fileKey, mimeType) {
  const signedUrl = regions.main.s3.getSignedUrl('putObject', {
    Bucket: regions.main.bucket,
    Key: fileKey,
    ContentType: mimeType || 'application/octet-stream',
    Expires: 60 * 5,
  });

  return signedUrl;
}

async function upload(key, data, mimeType) {
  await regions.main.s3.upload({
    Body: data,
    Bucket: regions.main.bucket,
    ContentType: mimeType || 'application/octet-stream',
    Key: key,
  }).promise();
}

module.exports = {
  getSignedUploadUrl,
  regions,
  upload,
};
