const Organization = require('./db/Organization');
const { validateAuthorizationHeader } = require('./utils/auth');
const basicValidator = require('./utils/basicValidator');
const { upload } = require('./utils/kv');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');

const Website = require('./db/Website');

async function uploadFile(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');

    await basicValidator(data, [
      { key: 'imageName' },
      { key: 'targetBucket' },
      { key: 'mimeType' },
      { key: 'fileData' },
    ]);

    const account = await validateAuthorizationHeader(event);
    if (account._apiError) throw account;

    const {
      imageName,
      mimeType,
      fileData,
    } = data;

    const targetBucket = data.targetBucket.toLowerCase();
    let folder = null;

    if (targetBucket === 'accounts') {
      if (!['avatar'].includes(imageName)) {
        throw makeApiError({
          message: 'Cannot upload to this location',
          status: 401,
        });
      }

      folder = account.id;
    } else if (targetBucket === 'assets') {
      folder = account.organizationId;
    } else {
      throw makeApiError({
        message: 'Cannot upload to this location',
        status: 401,
      });
    }

    const key = `${targetBucket}/${folder}/${imageName}`;

    const url = await upload(key, fileData, mimeType, account.id);

    return respondWithSuccess({ url });
  } catch (error) {
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to upload image, try again?',
      status: 500,
    }));
  }
}

exports.handler = uploadFile;
