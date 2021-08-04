const { get } = require('lodash');
const mongoose = require('../db');
const Assembly = require('../db/Assembly');
const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithEmptySuccess } = require('../utils/responder');

async function updateWebsite(request, response) {
  const { body, params: { websiteId } } = request;

  await basicValidator(body, [
    { key: 'updatedVersion' },
    { key: 'description' },
  ]);

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const { updatedVersion, description } = body;

  const website = await Website.findById(mongoose.Types.ObjectId(websiteId)).exec();
  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  const updatedVersionData = JSON.parse(updatedVersion);
  const draftData = website.draftVersion ? JSON.parse(website.draftVersion.data) : {};

  function merge(path) {
    return {
      ...get(draftData, path, {}),
      ...get(updatedVersionData, path, {}),
    };
  }

  const mergedPageData = Object
    .keys(get(updatedVersionData, 'pages', {}))
    .reduce((acc, pageId) => ({
      ...acc,
      [pageId]: merge(`pages.${pageId}`),
    }), {});

  const mergedData = JSON.stringify({
    meta: merge('meta'),
    siteSettings: merge('siteSettings'),
    stylePresets: merge('stylePresets'),
    templatedFrom: merge('templatedFrom'),
    theme: merge('theme'),
    pages: {
      ...get(draftData, 'pages', {}),
      ...mergedPageData,
    },
  });

  const assembly = await Assembly.create({
    organization: account.organization._id,
    description,
    createdBy: account._id,
    data: mergedData,
  });

  await Website.update({ _id: websiteId }, { draftVersion: assembly._id });

  return respondWithEmptySuccess(response);
}

module.exports = updateWebsite;
