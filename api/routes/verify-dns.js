const dns = require('dns');
const util = require('util');

const mongoose = require('mongoose');
const ms = require('ms');
const DomainRecord = require('../db/DomainRecord');
const { publishJob } = require('../queue/ssl');
const { validateAuthorizationHeader } = require('../utils/auth');
const basicValidator = require('../utils/basicValidator');
const makeApiError = require('../utils/makeApiError');
const { respondWithSuccess } = require('../utils/responder');
const { transformDomainRecord } = require('../utils/transformer');

const A_RECORDS = process.env.EDGE_IP_ADDRESSES.split(',')
  .filter((ip) => ip.split('.').length === 4);

const resolve4 = util.promisify(dns.resolve4);

async function verify(name) {
  try {
    const addresses = await resolve4(name);

    return addresses.every((address) => A_RECORDS.includes(address))
      && addresses.length === A_RECORDS.length;
  } catch (error) {
    console.log(error);
    return false;
    // TODO: Check if DNS specific error?
    // console.log(error);
  }
}

async function verifyDNS(request, response) {
  const { params: { domainRecordId } } = request;

  const account = await validateAuthorizationHeader(request);
  if (account._apiError) throw account;

  const domainRecord = await DomainRecord
    .findById(mongoose.Types.ObjectId(domainRecordId))
    .exec();

  if (!domainRecord) {
    throw makeApiError({ message: 'This dns record does not exist', status: 404 });
  }

  if (!domainRecord.organization._id.equals(account.organization._id)) {
    throw makeApiError({ message: 'You do not have access to this dns record', status: 401 });
  }

  if (!!domainRecord.lastCheckedDns) {
    const lastCheckedDnsTime = new Date(domainRecord.lastCheckedDns).getTime();
    const threshold = Date.now() - ms('10 seconds');

    if (threshold < lastCheckedDnsTime) {
      throw makeApiError({
        message: `Please try again in ${Math.round((lastCheckedDnsTime - threshold) / 1000)} second(s)`,
        status: 400,
      });
    }
  }

  const verificationsToRun = [
    verify(domainRecord.name),
  ];

  if (domainRecord.name.split('.').length === 2) {
    verificationsToRun.push(verify(`www.${domainRecord.name}`));
  }

  const verifications = await Promise.all(verificationsToRun);

  const verified = verifications.every((verification) => !!verification);

  const updatedDomainRecord = await DomainRecord.findOneAndUpdate(
    { _id: domainRecord._id },
    { verified, lastCheckedDns: Date.now() },
    { new: true },
  ).exec();

  if (
    !!verified
    && !updatedDomainRecord.lastObtainedSslOn
    && process.env.NODE_ENV !== 'development'
  ) {
    await publishJob({ domainRecordId: domainRecord._id.toString() });
  }

  return respondWithSuccess(response, {
    domainRecord: transformDomainRecord(updatedDomainRecord, account),
    verified,
  });
}

module.exports = verifyDNS;
