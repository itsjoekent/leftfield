const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const isTrueString = require('../utils/isTrueString');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformWebsite } = require('../utils/transformer');

async function getOrganizationWebsites(request, response) {
  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const {
    name,
    sortOn,
    sortDirection,
    startAt,
    fillDraftSnapshot,
    fillSnapshotRoute,
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

  const options = {
    organizationId: account.organization._id,
    name,
    sortOn,
    sortDirection,
    startAt,
    fillDraftSnapshot: isTrueString(fillDraftSnapshot),
    fillSnapshotRoute,
  };

  const websites = await Website.findAllForOrganization(options);

  return respondWithSuccess(response, {
    websites: websites.map((website) => transformWebsite(website, account)),
  });
}

module.exports = getOrganizationWebsites;
