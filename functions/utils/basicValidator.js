const { get } = require('lodash');
const makeApiError = require('./makeApiError');

function isDefined(value) {
  return typeof value !== 'undefined' && value !== null;
}

module.exports = async function basicValidator(payload, validations) {
  for (const validation of validations) {
    const {
      key,
      humanName,
      validationFunction = isDefined,
      errorMessage = 'Missing {humanName}',
      errorCode = 400,
    } = validation;

    const passes = await validationFunction(get(payload, key, null));

    if (!passes) {
      throw makeApiError({
        message: errorMessage.replace('{humanName}', humanName || key),
        status: errorCode,
      });
    }
  }
}
