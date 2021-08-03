const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const getPathParams = require('../utils/getPathParams');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformWebsite } = require('../utils/transformer');

async function getWebsite(request, response) {
  const { websiteId } = request.params;

  if (!websiteId) {
    throw makeApiError('Missing website id', 400);
  }

  const account = await validateAuthorizationHeader(event);
  if (account._apiError) throw account;

  const website = await Website.findById(websiteId);
  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  return respondWithSuccess(response, {
    website: transformWebsite(website),
  });
}

module.exports = getWebsite;
