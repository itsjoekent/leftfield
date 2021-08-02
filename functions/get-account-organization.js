const Account = require('./db/Account');
const Organization = require('./db/Organization');
const { validateAuthorizationHeader } = require('./utils/auth');
const makeApiError = require('./utils/makeApiError');
const { respondWithSuccess, respondWithError } = require('./utils/responder');
const { transformAccount, transformOrganization } = require('./utils/transformer');

async function getAccountOrganization(event, context) {
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

    return respondWithSuccess({
      account: transformAccount(account),
      organization: transformOrganization(organization, account),
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

exports.handler = getAccountOrganization;
