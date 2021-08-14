const fetch = require('node-fetch');

const makeApiError = require('./makeApiError');

const BASE_PATH = 'https://api.cloudflare.com/client/v4/accounts';

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_KEY = process.env.CF_API_KEY;

async function put(
  namespace,
  key,
  data = {},
) {
  const now = Date.now();

  const keyEncoded = encodeURIComponent(key);

  const response = await fetch(`${BASE_PATH}/${CF_ACCOUNT_ID}/storage/kv/namespaces/${namespace}/values/${keyEncoded}`, {
    headers: {
      'Authorization': `Bearer ${CF_API_KEY}`,
      'Content-Type': 'text/plain',
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new makeApiError({
      error: new Error(`CF Errors: ${JSON.stringify((json || {}).errors)}`),
      message: 'Failed to upload',
      status: 500,
    });
  }
}

module.exports = { put };
