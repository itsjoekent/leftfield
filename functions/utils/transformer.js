function transformAccount(account) {
  const {
    id,
    email,
    firstName,
    organizationId,
  } = account;

  return {
    id,
    email,
    firstName,
    organizationId,
  };
}

function transformOrganization(organization) {
  const {
    id,
    name,
    size,
    team,
    websites,
  } = organization;

  return {
    id,
    name,
    size,
    team,
    websites,
  };
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
