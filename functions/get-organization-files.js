const File = require('./db/File');
const { validateAuthorizationHeader } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');
const { transformFile } = require('./utils/transformer');

async function getOrganizationFiles(event, context) {
  try {
    const account = await validateAuthorizationHeader(event);
    if (account._apiError) throw account;

    const {
      fileTypes,
      name,
      sortOn,
      sortDirection,
      startAt,
    } = event.queryStringParameters;

    if (sortOn && !['createdAt', 'updatedAt'].includes(sortOn)) {
      throw makeApiError({
        message: 'Invalid sort property',
        status: 400,
      });
    }

    if (
      (!!sortDirection && typeof sortDirection !== 'number')
      && (typeof sortDirection === 'number' && sortDirection === 0)
    ) {
      throw makeApiError({
        message: 'Invalid sort direction',
        status: 400,
      });
    }

    const files = await File.findAllForOrganization(
      account.organizationId,
      fileTypes || null,
      name || null,
      startAt || null,
      sortOn || 'updatedAt',
      sortDirection || 1,
    );

    return respondWithSuccess({
      files: files.map((file) => transformFile(file, account)),
    });
  } catch (error) {
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to get files, try again?',
      status: 500,
    }));
  }
}

exports.handler = getOrganizationFiles;
