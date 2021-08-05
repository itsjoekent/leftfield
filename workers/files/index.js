const DEFAULT_MAX_AGE = 60 * 60 * 24; // 1 day (seconds)

/**
 * Remove the trailing slash from a string (ignores root slash).
 *
 * @param  {String} input
 * @return {String}
 */
function removeTrailingSlash(input) {
  if (input === '/') {
    return input;
  }

  if (input.endsWith('/')) {
    return input.substring(0, input.length - 1);
  }

  return input;
}

/**
 * Get the normalized host and path from a Request.
 *
 * @param  {Request} request
 * @return {Object}
 */
function getNormalizedHostAndPath(request) {
  const { url } = request;
  const { pathname, hostname } = new URL(url);

  return {
    pathname: removeTrailingSlash(pathname.toLowerCase()),
    hostname: hostname.toLowerCase(),
    originalPathname: pathname,
    originalHostname: hostname,
  };
}

/**
 * Run a fetch against a URL
 * If the status is a server error, run a second fetch.
 *
 * @param {String} firstUrl
 * @param {String} secondUrl
 * @return {Response}
 */
async function fetchWithRetry(firstUrl, secondUrl, stopAfter = 400) {
  const firstResponse = await fetch(firstUrl);
  if (firstResponse.status < stopAfter) {
    return [firstResponse, firstUrl];
  }

  const secondResponse = await fetch(secondUrl);
  return [secondResponse, secondUrl];
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleFileRequest(request) {
  const { pathname } = getNormalizedHostAndPath(request);
  const key = pathname.replace('/file/', '');

  const metadataStringified = await FILES_NAMESPACE.get(key);

  if (typeof metadataStringified !== 'string') {
    return new Response('', { status: 404 });
  }

  const metadata = JSON.parse(metadataStringified);

  const fileHeaders = {
    'Accept-Ranges': 'bytes',
    'Cache-Control': `max-age=${DEFAULT_MAX_AGE}, public, must-revalidate`,
    'Content-Length': metadata.fileSize,
    'Content-Type': metadata.mimeType,
    'Date': new Date().toUTCString(),
    'ETag': metadata.etag,
    'Last-Modified': new Date(metadata.lastModifiedAt).toUTCString(),
  };

  const ifNoneMatch = request.headers.get('If-None-Match');
  const ifModifiedSince = request.headers.get('If-Modified-Since');

  if (!!ifNoneMatch && metadata.etag === ifNoneMatch) {
    return new Response('', {
      status: 304,
      headers: fileHeaders,
    });
  }

  if (!!ifModifiedSince && metadata.lastModifiedAt > new Date(ifModifiedSince).getTime()) {
    return new Response('', {
      status: 304,
      headers: fileHeaders,
    });
  }

  let spacesResponse = null;
  let servedFrom = null;

  const eastSpacesUrl = `${NY_SPACE}/${key}`;
  const westSpacesUrl = `${SF_SPACE}/${key}`;

  const urlLabelTable = {
    [eastSpacesUrl]: 'NY',
    [westSpacesUrl]: 'SF',
  };

  let firstUrl = eastSpacesUrl;
  let secondUrl = westSpacesUrl;

  if (request.cf) {
    const { longitude } = request.cf;
    const isEast = longitude >= -100 && longitude <= 60;

    firstUrl = isEast ? eastSpacesUrl : westSpacesUrl;
    secondUrl = isEast ? westSpacesUrl : eastSpacesUrl;
  }

  const [fetchResponse, used] = await fetchWithRetry(firstUrl, secondUrl);
  spacesResponse = fetchResponse;
  servedFrom = urlLabelTable[used];

  // TODO: Handle spaces response 4xx & 5xx

  return new Response(spacesResponse.body, {
    headers: {
      ...fileHeaders,
      'X-Leftfield-Served-From': servedFrom,
    },
  });
}

// Uint8ArrayFromBase64(value)
// function Uint8ArrayFromBase64(base64) {
//   return Uint8Array.from(atob(base64), (v) => v.charCodeAt(0));
// }

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const { pathname } = getNormalizedHostAndPath(request);

    if (pathname.startsWith('/file')) {
      return await handleFileRequest(request);
    }

    return new Response('', { status: 404 });
  } catch (error) {
    if (NODE_ENV === 'production') {
      return new Response('Encountered unexpected error', { status: 500 });
    }

    return new Response(error.toString(), { status: 500 });
  }
}
