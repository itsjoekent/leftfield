const { get } = require('lodash');
const mongoose = require('mongoose');
const DataContainer = require('../db/DataContainer');
const Snapshot = require('../db/Snapshot');
const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const isLengthyString = require('../utils/isLengthyString');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');

async function updateWebsite(request, response) {
  const { body, params: { websiteId } } = request;

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const {
    updatedData = {},
    description = '',
  } = body;

  if (!isLengthyString(updatedData)) {
    throw makeApiError({ message: 'Missing updatedData', status: 400 });
  }

  const { pages: updatedPages, ...updatedAssembly } = JSON.parse(updatedData);

  const website = await Website
    .findById(mongoose.Types.ObjectId(websiteId))
    .populate('draftSnapshot')
    .exec();

  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  const snapshotFields = {
    assembly: website.draftSnapshot?.assembly?._id || null,
    pages: website.draftSnapshot?.pages || {},
  };

  if (!!updatedAssembly) {
    const assembly = await DataContainer.create({
      organization: account.organization._id,
      website: website._id,
      data: JSON.stringify(updatedAssembly),
    });

    snapshotFields.assembly = assembly._id;
  }

  if (!!updatedPages && !!Object.keys(updatedPages || {}).length) {
    const pages = await Promise.all(
      Object.keys(updatedPages).map(async (pageId) => {
        const data = updatedPages[pageId];

        const page = await DataContainer.create({
          organization: account.organization._id,
          website: website._id,
          data: JSON.stringify(data),
        });

        return { page, data };
      })
    );

    pages.forEach(({ page, data }) => snapshotFields.pages[data.route] = page._id);
  }

  const snapshot = await Snapshot.create({
    organization: account.organization._id,
    website: website._id,
    createdBy: account._id,
    description,
    ...snapshotFields,
  });

  await Website.updateOne({ _id: website._id }, { draftSnapshot: snapshot._id });

  return respondWithSuccess(response, {
    snapshotId: snapshot._id.toString(),
  });
}

module.exports = updateWebsite;
