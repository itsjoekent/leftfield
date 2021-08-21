const mongoose = require('mongoose');
const DataContainer = require('../db/DataContainer');
const Snapshot = require('../db/Snapshot');
const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformWebsite } = require('../utils/transformer');

async function getWebsite(request, response) {
  const { websiteId } = request.params;

  if (!websiteId) {
    throw makeApiError('Missing website id', 400);
  }

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const {
    fillDraftSnapshot,
    fillSnapshotRoute,
  } = request.query;

  let query = Website.findById(mongoose.Types.ObjectId(websiteId));
  if (fillDraftSnapshot) {
    const populate = {
      path: 'draftSnapshot',
      model: Snapshot,
      populate: [
        {
          path: 'assembly',
          model: DataContainer,
        },
      ],
    };

    if (fillSnapshotRoute) {
      populate.populate.push({
        path: `pages.${fillSnapshotRoute}`,
        model: DataContainer,
      });
    }

    query = query.populate(populate);
  }

  const website = await query.exec();
  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  return respondWithSuccess(response, {
    website: transformWebsite(website, account),
  });
}

module.exports = getWebsite;
