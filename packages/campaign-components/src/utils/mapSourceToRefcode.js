export default function mapSourceToRefcode() {
  const queryString = window.location.search;

  if (!queryString || !queryString.length) {
    return {};
  }

  const params = queryString.replace('?', '').split('&');

  return params.reduce((refcodes, param) => {
    const [key, value] = param.split('=');

    if (key === 'source' || key === 'subsource') {
      const mappedKey = key === 'source' ? 'refcode' : 'refcode2';

      return {
        ...refcodes,
        [mappedKey]: value,
      };
    }

    return refcodes;
  }, {});
}
