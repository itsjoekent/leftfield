const { get } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

function transformAccount(account, requestingAccount = null) {
  if (ObjectId.isValid(account)) {
    return account.toString();
  }

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

function transformDataContainer(dataContainer, requestingAccount = null) {
  if (ObjectId.isValid(dataContainer)) {
    return dataContainer.toString();
  }

  const {
    _id,
    organization,
    website,
    data,
    createdAt,
  } = dataContainer;

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    website: transformWebsite(website, requestingAccount),
    data: JSON.parse(data || '{}'),
    createdAt,
  };
}

function transformFile(file, requestingAccount = null) {
  if (ObjectId.isValid(file)) {
    return file.toString();
  }

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
  if (ObjectId.isValid(organization)) {
    return organization.toString();
  }

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

function transformSnapshot(snapshot, requestingAccount = null) {
  if (ObjectId.isValid(snapshot)) {
    return snapshot.toString();
  }

  const {
    _id,
    assembly,
    description,
    createdAt,
    createdBy,
    organization,
    website,
  } = snapshot;

  const pages = Object.keys(snapshot.pages || {}).reduce((acc, route) => ({
    ...acc,
    [route]: transformDataContainer(snapshot.pages[route], requestingAccount),
  }), {});

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    website: transformWebsite(website, requestingAccount),
    assembly: transformDataContainer(assembly, requestingAccount),
    pages,
    description,
    createdBy: transformAccount(createdBy, requestingAccount),
    createdAt,
  };
}

function transformWebsite(website, requestingAccount = null) {
  if (ObjectId.isValid(website)) {
    return website.toString();
  }

  const {
    _id,
    organization,
    name,
    domain,
    draftSnapshot,
    publishedSnapshot,
    lastPublishedAt,
    lastPublishedBy,
  } = website;

  return {
    id: _id.toString(),
    organization: transformOrganization(organization, requestingAccount),
    name,
    domain,
    draftSnapshot: draftSnapshot
      ? transformSnapshot(draftSnapshot, requestingAccount)
      : null,
    publishedSnapshot: publishedSnapshot
      ? transformSnapshot(publishedSnapshot, requestingAccount)
      : null,
    lastPublishedAt,
    lastPublishedBy: lastPublishedBy
      ? transformAccount(lastPublishedBy, requestingAccount)
      : null,
  };
}

module.exports = {
  transformAccount,
  transformFile,
  transformOrganization,
  transformWebsite,
};
