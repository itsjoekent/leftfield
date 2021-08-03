const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithEmptySuccess } = require('../utils/responder');

async function updateWebsite(request, response) {
  const { body, params: { websiteId } } = request;

  await basicValidator(body, [
    { key: 'updatedVersion' },
  ]);

  const account = await validateAuthorizationHeader(event);
  if (account._apiError) throw account;

  const { updatedVersion } = body;

  const website = await Website.findById(websiteId);
  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  await Website.update({ _id: websiteId }, { data: updatedVersion });

  return respondWithEmptySuccess(response);
}

module.exports = updateWebsite;
