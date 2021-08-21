const mongoose = require('mongoose');
const DataContainer = require('../db/DataContainer');
const Snapshot = require('../db/Snapshot');
const { validateAuthorizationHeader } = require('../utils/auth');
const isLengthyString = require('../utils/isLengthyString');;
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformSnapshot } = require('../utils/transformer');

async function getSnapshot(request, response) {
  const { snapshotId } = request.params;

  if (!snapshotId) {
    throw makeApiError('Missing website id', 400);
  }

  const account = await validateAuthorizationHeader(event);
  if (account._apiError) throw account;

  const { route = '/' } = request.query;

  if (!isLengthyString(route) || !route.startsWith('/')) {
    throw makeApiError('Page route is not formatted correctly', 400);
  }

  const snapshot = await Snapshot
    .findById(mongoose.Types.ObjectId(snapshotId))
    .populate('assembly');
    .populate({ path: `pages.${route}`, model: DataContainer });
    .exec();

  if (!snapshot) {
    throw makeApiError({ message: 'This snapshot does not exist', status: 404 });
  }

  if (!snapshot.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this snapshot', status: 401 });
  }

  return respondWithSuccess(response, {
    snapshot: transformSnapshot(snapshot, account),
  });
}

module.exports = getSnapshot;
