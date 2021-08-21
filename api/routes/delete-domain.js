const mongoose = require('mongoose');
const Website = require('../db/Website');
const DomainRecord = require('../db/DomainRecord');
const { validateAuthorizationHeader } = require('../utils/auth');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformWebsite } = require('../utils/transformer');

async function deleteDomain(request, response) {
  const { params: { domainRecordId, websiteId } } = request;

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const website = await Website
    .findById(mongoose.Types.ObjectId(websiteId))
    .exec();

  if (!website) {
    throw makeApiError({ message: 'This website does not exist', status: 404 });
  }

  if (!website.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this website', status: 401 });
  }

  const domainRecord = await DomainRecord
    .findById(mongoose.Types.ObjectId(domainRecordId))
    .exec();

  if (!domainRecord) {
    throw makeApiError({ message: 'This domain record does not exist', status: 404 });
  }

  if (!domainRecord.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this domain record', status: 401 });
  }

  const updatedWebsite = await Website.findOneAndUpdate(
    { _id: website._id },
    { '$pull': { domains: domainRecord._id } },
    { new: true },
  ).populate('domains').exec();

  await DomainRecord.deleteOne({ _id: domainRecord._id });

  return respondWithSuccess(response, {
    website: transformWebsite(updatedWebsite, account),
  });
}

module.exports = deleteDomain;
