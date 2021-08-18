const crypto = require('crypto');
const parser = require('ua-parser-js');
const Account = require('../db/Account');
const { signToken } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const { sendPasswordResetEmail } = require('../utils/email');
const { respondWithEmptySuccess } = require('../utils/responder');

async function requestPasswordReset(request, response) {
  const { body } = request;

  await basicValidator(body, [{ key: 'email', humanName: 'email' }]);

  const { email } = body;
  const account = await Account.findByEmail(email);

  if (!account) {
    throw makeApiError({ message: 'No account exists for this email' });
  }

  const jwt = await signToken({
    expiration: '2 hours',
    subject: account.email,
    subjectType: 'email',
    secret: crypto.createSecretKey(
      Buffer.from(`${account.password}-${account.createdAt}`, 'utf8'),
    ),
  });

  const resetUrl = `https://${process.env.DOMAIN}/reset-password?id=${encodeURIComponent(account._id.toString())}&token=${encodeURIComponent(jwt)}`;

  const userAgent = parser(request.headers['user-agent']);

  const emailResponse = await sendPasswordResetEmail(
    account.email,
    account.name,
    resetUrl,
    userAgent?.os?.name,
    userAgent?.browser?.name,
  );

  if (emailResponse?._apiError) {
    throw emailResponse;
  }

  return respondWithEmptySuccess(response);
}

module.exports = requestPasswordReset;
