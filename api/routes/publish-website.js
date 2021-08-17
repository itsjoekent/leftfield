const { get } = require('lodash');
const { v4: uuid } = require('uuid');
const mongoose = require('../db');
const Snapshot = require('../db/Snapshot');
const Website = require('../db/Website');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const { publisher } = require('../utils/buildQueue');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');

async function publishWebsite(request, response) {
  const { body, params: { websiteId } } = request;

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const website = await Website.findById(mongoose.Types.ObjectId(websiteId)).exec();

  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  if (!body.snapshotId && !website.draftSnapshot) {
    throw makeApiError({ message: 'Invalid snapshot id given, or no draft snapshot exists', status: 400 });
  }

  const publishedSnapshotId = body.snapshotId
    ? mongoose.Types.ObjectId(body.snapshotId)
    : website.draftSnapshot._id;

  if (!publishedSnapshotId) {
    throw makeApiError({ message: 'Invalid snapshot id given, or no draft snapshot exists', status: 400 });
  }

  const snapshot = await Snapshot.findById(publishedSnapshotId).exec();

  if (!snapshot) {
    throw makeApiError({ message: 'This snapshot does not exist', status: 404 });
  }

  if (!snapshot.website._id.equals(website._id)) {
    throw makeApiError({ message: 'This snapshot cannot be published on this website', status: 400 });
  }

  await Website.updateOne(
    { _id: website._id },
    {
      publishedSnapshot: publishedSnapshotId,
      lastPublishedAt: Date.now(),
      lastPublishedBy: account._id,
    },
  );

  const buildId = uuid();
  const job = publisher.createJob({ snapshotId: publishedSnapshotId.toString() });

  await job.setId(buildId).backoff('exponential', 1000).save();

  return respondWithSuccess(response, { buildId });
}

module.exports = publishWebsite;
