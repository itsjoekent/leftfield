const fetch = require('node-fetch');
const FormData = require('form-data');
const md5 = require('md5');

const makeApiError = require('./makeApiError');

const BASE_PATH = 'https://api.cloudflare.com/client/v4/accounts';

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_NAMESPACE_ID = process.env.CF_NAMESPACE_ID;
const CF_API_KEY = process.env.CF_API_KEY;

const FILES_BASE_DOMAIN = process.env.FILES_BASE_DOMAIN;

async function upload(
  key,
  value,
  mimeType = 'text/plain',
  uploadedBy = null,
) {
  const now = Date.now();
  const etag = md5(value);

  const meta = JSON.stringify({
    createdAt: now,
    lastModifiedAt: now,
    etag,
    mimeType,
    uploadedBy,
  });

  const formData = new FormData();
  formData.append('value', value);
  formData.append('metadata', meta);

  const keyEncoded = encodeURIComponent(key);

  const response = await fetch(`${BASE_PATH}/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_NAMESPACE_ID}/values/${keyEncoded}`, {
    headers: {
      'Authorization': `Bearer ${CF_API_KEY}`,
      'Content-Type': `multipart/form-data; charset=utf-8; boundary=${formData.getBoundary()}`,
    },
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const json = await response.json();
    throw new makeApiError({
      error: new Error(`CF Errors: ${JSON.stringify((json || {}).errors)}`),
      message: 'Failed to upload',
      status: 500,
    });
  }

  return `${FILES_BASE_DOMAIN}/file/${key}`;
}

module.exports = { upload };
