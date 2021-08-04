const Account = require('../db/Account');
const Organization = require('../db/Organization');
const { validateAuthorizationHeader } = require('../utils/auth');
const { respondWithSuccess } = require('../utils/responder');
const { transformAccount, transformOrganization } = require('../utils/transformer');

async function getProfile(request, response) {
  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const payload = { account: transformAccount(account, account) };

  const organization = await Organization.findById(account.organization._id);
  if (organization) {
    payload.organization = transformOrganization(organization, account);
  }

  return respondWithSuccess(response, payload);
}

module.exports = getProfile;
