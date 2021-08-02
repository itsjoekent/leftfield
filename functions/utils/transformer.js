const { get } = require('lodash');

function transformAccount(account) {
  const {
    id,
    email,
    firstName,
    lastName,
    organizationId,
  } = account;

  return {
    id,
    email,
    firstName,
    lastName,
    organizationId,
  };
}

function transformFile(file, requestingAccount = null) {
  if (
    !!file.organizationId
    && (
      !requestingAccount
      || file.organizationId !== requestingAccount.organizationId
    )
  ) {
    return null;
  }

  let {
    id,
    organizationId,
    name,
    uploadedBy,
    lastUpdatedBy,
    fileSize,
    createdAt,
    updatedAt,
  } = file;

  if (typeof lastUpdatedBy === 'object') {
    lastUpdatedBy = transformAccount(lastUpdatedBy);
  }

  if (typeof uploadedBy === 'object') {
    uploadedBy = transformAccount(uploadedBy);
  }

  return {
    id,
    organizationId,
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
    id,
    name,
    searchKey,
    size,
    team,
    websites,
  } = organization;

  const response = {
    id,
    name,
    size,
    team,
    websites,
  };

  return response;
}

function transformWebsite(website) {
  const {
    id,
    organizationId,
    name,
    domain,
    data,
  } = website;

  return {
    id,
    organizationId,
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
