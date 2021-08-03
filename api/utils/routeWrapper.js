const makeApiError = require('./makeApiError');
const { respondWithError } = require('./responder');

function routeWrapper(name) {
  async function onRequest(request, response) {
    try {
      const handler = require(`../routes/${name}`);
      await handler(request, response);
    } catch (error) {
      if (error._apiError) return respondWithError(response, error);

      return respondWithError(response, makeApiError({
        error,
        message: 'Encountered unexpected error, try again?',
        status: 500,
      }));
    }
  }

  return onRequest;
}

module.exports = routeWrapper;
