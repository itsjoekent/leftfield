const { v4: uuid } = require('uuid');
const Organization = require('../db/Organization');
const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformWebsite } = require('../utils/transformer');

async function createWebsite(request, response) {
  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const organization = await Organization.findById(account.organization._id);
  if (!organization) {
    throw makeApiError({
      message: 'No organization associated with this account',
      status: 403,
    });
  }

  const website = await Website.create({
    organization: organization._id,
    name: `${organization.name} Campaign Website`,
  });

  return respondWithSuccess(response, {
    website: transformWebsite({
      ...website,
      organization,
    }, account),
  });
}

module.exports = createWebsite;
