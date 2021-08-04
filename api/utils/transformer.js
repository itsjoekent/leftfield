const { get } = require('lodash');

function transformAccount(account, requestingAccount = null) {
  const {
    _id,
    email,
    firstName,
    lastName,
  } = account;

  const data = {
    id: _id.toString(),
    firstName,
    lastName,
  };

  if (requestingAccount && _id.equals(requestingAccount._id)) {
    data.email = email;
  }

  return data;
}

function transformAssembly(assembly, requestingAccount = null) {
  const {
    _id,
    organization,
    description,
    createdBy,
    data,
    createdAt,
  } = assembly;

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    description,
    createdBy: transformAccount(createdBy, requestingAccount),
    data,
    createdAt,
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
    fileKey,
    fileSize,
    fileType,
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
    fileKey,
    fileSize,
    fileType,
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
    draftVersion,
    publishedVersion,
  } = website;

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    name,
    domain,
    data,
    draftVersion: draftVersion ? transformAssembly(draftVersion, requestingAccount) : null,
    publishedVersion: publishedVersion ? transformAssembly(publishedVersion, requestingAccount) : null,
  };
}

module.exports = {
  transformAccount,
  transformAssembly,
  transformFile,
  transformOrganization,
  transformWebsite,
};
