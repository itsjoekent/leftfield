const File = require('../db/File');
const Organization = require('../db/Organization');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const { upload } = require('../utils/kv');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');

const Website = require('../db/Website');

async function uploadFile(request, response) {
  const { body } = request;

  await basicValidator(body, [
    { key: 'originalFileName' },
    { key: 'fileName' },
    { key: 'targetBucket' },
    { key: 'mimeType' },
    { key: 'fileData' },
  ]);

  const account = await validateAuthorizationHeader(event);
  if (account._apiError) throw account;

  const {
    originalFileName,
    fileName,
    mimeType,
    fileData,
  } = body;

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

  const url = await upload(key, fileData, mimeType, account._id);

  await File.create({
    organization: targetBucket === 'assets' ? account.organization._id : null,
    name: originalFileName.substring(0, 256),
    uploadedBy: account._id,
    lastUpdatedBy: account._id,
    fileKey: key,
    fileSize: fileData.length,
    fileType: mimeType,
  });

  return respondWithSuccess(response, { url });
}

module.exports = uploadFile;
