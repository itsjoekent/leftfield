const Account = require('../db/Account');
const { validateAuthorizationHeader } = require('../utils/auth');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformAccount } = require('../utils/transformer');

async function updateProfile(request, response) {
  const { body } = request;

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const { name, avatar } = body;

  const updatedAccount = await Account.findOneAndUpdate(
    { _id: account._id },
    { name, avatar },
    { new: true },
  ).exec();

  return respondWithSuccess(response, {
    account: transformAccount(updatedAccount, account),
  });
}

module.exports = updateProfile;
