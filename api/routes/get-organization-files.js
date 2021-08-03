const File = require('../db/File');
const { validateAuthorizationHeader } = require('../utils/auth');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformFile } = require('../utils/transformer');

async function getOrganizationFiles(request, response) {
  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const {
    fileTypes,
    name,
    sortOn,
    sortDirection,
    startAt,
  } = request.query;

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
    account.organization._id,
    fileTypes || null,
    name || null,
    startAt || null,
    sortOn || 'updatedAt',
    sortDirection || 1,
  );

  return respondWithSuccess(response, {
    files: files.map((file) => transformFile(file, account)),
  });
}

module.exports = getOrganizationFiles;
