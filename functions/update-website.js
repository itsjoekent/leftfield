const Website = require('./db/Website');
const { validateAuthorizationHeader } = require('./utils/auth');
const basicValidator = require('./utils/basicValidator');
const makeApiError = require('./utils/makeApiError');
const { respondWithEmptySuccess, respondWithError } = require('./utils/responder');

async function updateWebsite(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');

    await basicValidator(data, [
      { key: 'websiteId' },
      { key: 'updatedVersion' },
    ]);

    const account = await validateAuthorizationHeader(event);
    if (account._apiError) throw account;

    const { websiteId, updatedVersion } = data;

    const website = await Website.findById(websiteId);
    if (!website) {
      throw makeApiError({ message: 'This website does not exist', status: 404 });
    }

    if (website.organizationId !== account.organizationId) {
      throw makeApiError({ message: 'You do not have access to this website', status: 401 });
    }

    await Website.update({ id: websiteId }, { data: updatedVersion });

    return respondWithEmptySuccess();
  } catch (error) {
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to update website, try again?',
      status: 500,
    }));
  }
}

exports.handler = updateWebsite;
