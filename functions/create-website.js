const { v4: uuid } = require('uuid');
const Organization = require('./db/Organization');
const Website = require('./db/Website');
const { validateAuthorizationHeader } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');
const { transformWebsite } = require('./utils/transformer');

async function createWebsite(event, context) {
  try {
    const account = await validateAuthorizationHeader(event);
    if (account._apiError) throw account;

    const organization = await Organization.findById(account.organizationId);
    if (!organization) {
      throw makeApiError({
        message: 'No organization associated with this account',
        status: 403,
      });
    }

    const websiteId = uuid();

    const website = await Website.create({
      id: websiteId,
      organizationId: organization.id,
      name: `${organization.name} Campaign Website`,
    });

    await Organization.update(
      { id: organization.id },
      { 'websites': [...(organization.websites || []), websiteId] },
    );

    return respondWithSuccess({
      website: transformWebsite(website),
    });
  } catch (error) {
    if (error._apiError) return respondWithError(error);

    return respondWithError(makeApiError({
      error,
      message: 'Failed to fetch account details, try again?',
      status: 500,
    }));
  }
}

exports.handler = createWebsite;
