const { v4: uuid } = require('uuid');
const File = require('../db/File');
const Organization = require('../db/Organization');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const { put } = require('../utils/cloudflareKeyValue');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { getSignedUploadUrls } = require('../utils/spaces');

const Website = require('../db/Website');

async function uploadFile(request, response) {
  const { body } = request;

  await basicValidator(body, [
    { key: 'hash' },
    { key: 'fileSize' },
    { key: 'mimeType' },
    { key: 'originalFileName' },
    { key: 'targetBucket' },
  ]);

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const {
    hash,
    fileSize,
    mimeType,
    originalFileName,
  } = body;

  const fileName = uuid();

  const targetBucket = body.targetBucket.toLowerCase();
  let folder = null;

  if (targetBucket === 'accounts') {
    if (!['avatar'].includes(fileName)) {
      throw makeApiError({
        message: 'Cannot upload to this location',
        status: 401,
      });
    }

    folder = account._id.toString();
  } else if (targetBucket === 'assets') {
    folder = account.organization._id.toString();
  } else {
    throw makeApiError({
      message: 'Cannot upload to this location',
      status: 401,
    });
  }

  const key = `${targetBucket}/${folder}/${fileName}`;
  const url = `${process.env.FILES_DOMAIN}/file/${key}`;

  const uploadUrls = getSignedUploadUrls(key);

  await Promise.all([
    put(
      process.env.CF_FILES_NAMESPACE_ID,
      key,
      {
        createdAt: now,
        etag: hash,
        fileSize,
        lastModifiedAt: now,
        mimeType,
      },
    ),
    File.create({
      organization: targetBucket === 'assets' ? account.organization._id : null,
      name: originalFileName.substring(0, 256),
      uploadedBy: account._id,
      lastUpdatedBy: account._id,
      fileKey: key,
      fileSize,
      fileType: mimeType,
    }),
  ]);

  return respondWithSuccess(response, { key, uploadUrls, url });
}

module.exports = uploadFile;
