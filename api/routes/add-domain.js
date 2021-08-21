const mongoose = require('mongoose');
const Website = require('../db/Website');
const DomainRecord = require('../db/DomainRecord');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformDomainRecord, transformWebsite } = require('../utils/transformer');

async function addDomain(request, response) {
  const { body, params: { websiteId } } = request;

  await basicValidator(body, [
    { key: 'name', humanName: 'domain name' },
  ]);

  const { name } = body;

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

  const existingDomainRecord = await DomainRecord
    .findOne({ name: name.toLowerCase() })
    .exec();

  if (existingDomainRecord) {
    throw makeApiError({ message: 'A campaign has already attached this domain to their Leftfield website', status: 409 });
  }

  const domainRecord = await DomainRecord.create({
    organization: website.organization._id,
    website: website._id,
    name,
  });

  const updatedWebsite = await Website.findOneAndUpdate(
    { _id: website._id },
    { '$push': { domains: domainRecord._id } },
    { new: true },
  ).populate('domains').exec();

  return respondWithSuccess(response, {
    website: transformWebsite(updatedWebsite, account),
    domainRecord: transformDomainRecord(domainRecord, account),
  });
}

module.exports = addDomain;
