export default function makeActBlueLink(donateUrl, customRefcodes) {
  if (!donateUrl || typeof donateUrl !== 'string' || !donateUrl.length) {
    return '';
  }

  if (!customRefcodes || !Object.keys(customRefcodes).length) {
    return donateUrl;
  }

  const [baseCustomUrlUnsourced, defaultParams] = donateUrl.split('?');

  // Extract the default refcodes from the original URL
  const defaultRefcodes = (defaultParams || '').split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');

    return {
      ...acc,
      [decodeURIComponent(key)]: decodeURIComponent(value),
    };
  }, {});

  // Append custom query parameters if they dont already exist in the URL
  function reduceCustomRefcodes(entryUrl, targetRefcodes) {
    return Object.keys(targetRefcodes).sort().reduce((acc, key) => {
      if (acc.includes(`${key}=`)) {
        return acc;
      }

      const value = `${targetRefcodes[key]}`;

      if (value === 'undefined' || !value) {
        return acc;
      }

      const safeKey = encodeURIComponent(key);
      const conditionalSeperator = (acc.endsWith('?') || acc.endsWith('&')) ? '' : '&';

      return `${acc}${conditionalSeperator}${safeKey}=${encodeURIComponent(value)}`;
    }, entryUrl);
  }

  // Merge custom refcodes with default refcodes
  const customUrl = reduceCustomRefcodes(
    reduceCustomRefcodes(`${baseCustomUrlUnsourced}?`, customRefcodes),
    defaultRefcodes,
  );

  return customUrl;
}
