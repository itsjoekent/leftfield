const Website = require('./db/Website');
const { validateAuthorizationHeader } = require('./utils/auth');
const basicValidator = require('./utils/basicValidator');
const getPathParams = require('./utils/getPathParams');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');
const { transformWebsite } = require('./utils/transformer');

async function getWebsite(event, context) {
  try {
    const [websiteId] = getPathParams(event);

    if (!websiteId) {
      throw makeApiError('Missing website id', 400);
    }

    const account = await validateAuthorizationHeader(event);
    if (account._apiError) throw account;

    const website = await Website.findById(websiteId);
    if (!website) {
      throw makeApiError({ message: 'This website does not exist', status: 404 });
    }

    if (website.organizationId !== account.organizationId) {
      throw makeApiError({ message: 'You do not have access to this website', status: 401 });
    }
    
    return respondWithSuccess({
      website: transformWebsite(website),
    });
  } catch (error) {
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to get website, try again?',
      status: 500,
    }));
  }
}

exports.handler = getWebsite;