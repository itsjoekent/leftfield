const { respondWithSuccess } = require('../utils/responder');

const A_RECORDS = process.env.EDGE_IP_ADDRESSES.split(',')
  .filter((ip) => ip.split('.').length === 4)
  .map((ip) => ({ type: 'A', ip }));

async function getDNSRecords(request, response) {
  return respondWithSuccess(response, {
    records: [...A_RECORDS],
  });
}

module.exports = getDNSRecords;
