const { get } = require('lodash');

function transformAccount(account, requestingAccount = null) {
  const {
    _id,
    email,
    firstName,
    lastName,
  } = account;

  return {
    id: _id.toString(),
    email,
    firstName,
    lastName,
  };
}

function transformFile(file, requestingAccount = null) {
  if (!!file.organization && (
    !requestingAccount
    || !file.organization._id.equals(requestingAccount.organization._id)
  )) {
    return null;
  }

  const {
    _id,
    name,
    fileSize,
    createdAt,
    updatedAt,
  } = file;

  const organization = transformOrganization(file.organization, requestingAccount);
  const lastUpdatedBy = transformAccount(file.lastUpdatedBy, requestingAccount);
  const uploadedBy = transformAccount(file.uploadedBy, requestingAccount);

  return {
    id: _id.toString(),
    organization,
    name,
    uploadedBy,
    lastUpdatedBy,
    fileSize,
    createdAt,
    updatedAt,
  };
}

function transformOrganization(organization, requestingAccount = null) {
  const {
    _id,
    name,
    size,
  } = organization;

  const response = {
    id: _id.toString(),
    name,
    size,
  };

  return response;
}

function transformWebsite(website, requestingAccount = null) {
  const {
    _id,
    organization,
    name,
    domain,
    data,
  } = website;

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    name,
    domain,
    data,
  };
}

module.exports = {
  transformAccount,
  transformOrganization,
  transformWebsite,
};
