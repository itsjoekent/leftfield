const postmark = require('postmark');
const makeApiError = require('./makeApiError');

const client = new postmark.ServerClient(process.env.EMAIL_API_KEY);

async function sendPasswordResetEmail(
  to,
  name,
  resetUrl,
  osName,
  browserName,
) {
  try {
    return await client.sendEmailWithTemplate({
      From: `noreply@${process.env.EMAIL_DOMAIN}`,
      To: to,
      MessageStream: 'outbound',
      TemplateAlias: 'password-reset',
      TemplateModel: {
        'product_url': `https://${process.env.DOMAIN}`,
        'product_name': 'Leftfield',
        'name': name,
        'action_url': resetUrl,
        'operating_system': osName,
        'browser_name': browserName,
        'company_name': 'Pizza Rats LLC',
        'company_address': "company_address_Value"
      },
    });
  } catch (error) {
    return makeApiError({
      error,
      message: 'Failed to send email',
      status: 500,
    });
  }
}

module.exports = {
  sendPasswordResetEmail,
};
